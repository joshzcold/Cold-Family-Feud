package api

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gorilla/websocket"
)

func setupTestServer(_ *testing.T) (*httptest.Server, *Hub, func()) {
	hub := NewHub()
	go hub.run()

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		// Prevent gameTimeout from triggering
		SetConfig(3600)

		// Create a NEW room for EACH connection.
		room := InitalizeRoom(&Client{}, "TEST") // Dummy client
		room.Hub = hub                           // Use the test hub

		// Upgrade the connection.
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		// Create a real Client
		client := &Client{conn: conn, send: make(chan []byte, 256), stop: make(chan bool)}

		// Simulate the registration process.
		playerID := playerID()
		room.Game.RegisteredPlayers[playerID] = &registeredPlayer{Name: "Test Player"}
		registeredClient := &RegisteredClient{
			id:       playerID,
			client:   client,
			room:     &room,
			stopPing: make(chan bool),
		}
		room.registeredClients[playerID] = registeredClient
		hub.register <- client // Register to hub

		// Start pingInterval and the read/write pumps.
		go registeredClient.pingInterval()
		go client.writePump()
		go client.readPump()

		// ServeWs(w, r)
	})

	server := httptest.NewServer(mux)

	cleanup := func() {
		hub.stop <- true // Signal the hub to stop
		server.Close()
	}

	return server, hub, cleanup
}

func createTestConnection(_ *testing.T, serverURL string) (*websocket.Conn, error) {
	u, err := url.Parse(serverURL)
	if err != nil {
		return nil, err
	}
	u.Scheme = "ws"
	wsURL := u.String() + "/ws"

	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("dial error: %w", err)
	}
	return conn, nil
}