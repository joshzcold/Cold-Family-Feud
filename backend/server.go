package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/coder/websocket"
	"golang.org/x/time/rate"
)

type gameServer struct {


}

// socketServer is the WebSocket echo server implementation.
// It ensures the client speaks the echo subprotocol and
// only allows one message every 100ms with a 10 message burst.
type socketServer struct {
	// logf controls where logs are sent.
	logf func(f string, v ...interface{})
}

func (s socketServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conc, err := websocket.Accept(w, r, &websocket.AcceptOptions{})
	if err != nil {
		s.logf("%v", err)
		return
	}
	defer conc.CloseNow()

	l := rate.NewLimiter(rate.Every(time.Millisecond*100), 10)
	for {
		err = echo(conc, l)
		if websocket.CloseStatus(err) == websocket.StatusNormalClosure {
			return
		}
		if err != nil {
			s.logf("failed to echo with %v: %v", r.RemoteAddr, err)
			return
		}
	}
}

// echo reads from the WebSocket connection and then writes
// the received message back to it.
// The entire function has 10s to complete.
func echo(conc *websocket.Conn, rateLimiter *rate.Limiter) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	err := rateLimiter.Wait(ctx)
	if err != nil {
		return err
	}

	messageType, ioReader, err := conc.Reader(ctx)
	if err != nil {
		return err
	}

	writerCloser, err := conc.Writer(ctx, messageType)
	if err != nil {
		return err
	}

	_, err = io.Copy(writerCloser, ioReader)
	if err != nil {
		return fmt.Errorf("failed to io.Copy: %w", err)
	}

	err = writerCloser.Close()
	return err
}
