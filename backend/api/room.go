package api

import (
	"math/rand"
	"time"

	"github.com/google/uuid"
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

func (p *PingInterval) pingInterval() {
	ticker := time.NewTicker(5 * time.Second)
	defer func() {
		ticker.Stop()
	}()
	for {
		select {
			case <- ticker.C:
				if p.client.conn.CloseHandler() {
					
				}
			case <- p.stop:
				return
		}
	}

}

type PingInterval struct {
	id string
	client Client
	room room
	stop chan bool
}

type room struct {
	Game game `json:"game"`
	// Assign to ws Hub when hosting room
	Hub *Hub
	// Get lag of each client
	intervals map[string]PingInterval
}
