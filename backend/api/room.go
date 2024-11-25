package api

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const ()

var roomLetterLength = 4
var roomLetters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

// MakeRoom return a room code from random pick of characters of room code length
func roomCode() string {
	b := make([]rune, roomLetterLength)
	for i := range b {
		b[i] = roomLetters[rand.Intn(len(roomLetters))]
	}
	return string(b)
}

func playerID() string {
	return uuid.New().String()
}

// pingInterval Send a ping message every 5 seconds on a player
// This is to try and calcuate latency of a player when acting on buzzers
func (p *PingInterval) pingInterval() error {
	ticker := time.NewTicker(5 * time.Second)
	defer func() {
		ticker.Stop()
	}()
	p.client.conn.SetCloseHandler(func (code int, text string) error {
		p.stop <- true
		return nil
	})
	for {
		select {
		case <-ticker.C:
			_, _, err := p.client.conn.ReadMessage()
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Println("Player client disconnected stopping ping", p.id)
				return nil
			}
			player, ok := p.room.Game.RegisteredPlayers[p.id]
			if !ok {
				log.Println("Player not found stopping ping", p.id)
				return nil
			}
			player.Start = time.Now()
			message, err := NewSendPing(p.id)
			if err != nil {
				return fmt.Errorf(" %w", err)
			}
			p.client.send <- message
			log.Println("Sent ping to id", p.id)
		case <-p.stop:
			return nil
		}
	}
}

type PingInterval struct {
	id     string
	client Client
	room   *room
	stop   chan bool
}

type room struct {
	Game game `json:"game"`
	// Assign to ws Hub when hosting room
	Hub *Hub
	// Get lag of each client
	intervals map[string]PingInterval
}
