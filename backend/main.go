package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"
)

var cfg = struct {
	listenAddress string
	listenPort    int
}{}

func main() {

	flag.StringVar(&cfg.listenAddress, "listen-address", "127.0.0.1", "Address for server to bind to.")
	flag.IntVar(&cfg.listenPort, "listen-port", 8080, "Port for server to bind to.")
	flag.Parse()

	err := run()
	if err != nil {
		log.Fatal(err)
	}
}

// run starts a http.Server for the passed in address
// with all requests handled by echoServer.
func run() error {

	tcpListener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", cfg.listenAddress, cfg.listenPort))
	if err != nil {
		return err
	}
	log.Printf("listening on ws://%v", tcpListener.Addr())

	httpServer := &http.Server{
		Handler: socketServer{
			logf: log.Printf,
		},
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}
	errc := make(chan error, 1)
	go func() {
		errc <- httpServer.Serve(tcpListener)
	}()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt)
	select {
	case err := <-errc:
		log.Printf("failed to serve: %v", err)
	case sig := <-sigs:
		log.Printf("terminating: %v", sig)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	return httpServer.Shutdown(ctx)
}
