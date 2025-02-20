package api

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

const ()

var roomLetterLength = 4
var roomLetters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

var cfg struct {
	roomTimeoutSeconds int64
}

func SetConfig(timeoutSeconds int64) {
	cfg.roomTimeoutSeconds = timeoutSeconds
}

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

func (r *room) gameTimeout() error {
	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			timeout := time.Duration(cfg.roomTimeoutSeconds) * time.Second
			timeoutAgo := time.Now().UTC().Add(-timeout).UnixMilli()
			if r.Game.Tick > 0 && r.Game.Tick < timeoutAgo {
				log.Println("clearing room, no activity for", cfg.roomTimeoutSeconds, "seconds:", r.Game.Room)
				message, err := NewSendQuit()
				if err != nil {
					return fmt.Errorf(" %w", err)
				}
				r.Hub.broadcast <- message
				message, err = NewSendError(GameError{code: GAME_CLOSED})
				if err != nil {
					return fmt.Errorf(" %w", err)
				}
				r.Hub.broadcast <- message
				store.deleteLogo(r.Game.Room)
				store.deleteRoom(r.Game.Room)
				return nil
			}
		// If host quits, remove loop
		case <-r.cleanup:
			return nil
		}
	}
}

type RegisteredClient struct {
	id       string
	client   *Client
	room     *room
}

type roomConnections struct {
	Hub *Hub
	// Get lag of each client
	registeredClients map[string]*RegisteredClient
}

type room struct {
	Game *game `json:"game"`
	// Assign to ws Hub when hosting room
	roomConnections
	cleanup chan bool
}
