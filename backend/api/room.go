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
func (p *RegisteredClient) pingInterval() error {
	log.Println("Started ping for interval", p.id)
	ticker := time.NewTicker(5 * time.Second)
	defer func() {
		ticker.Stop()
	}()
	for {
		select {
		case <-ticker.C:
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
			if p.client.send != nil {
				p.client.send <- message
				log.Println("Sent ping to id", p.id)
			}
		case <-p.stopPing:
			log.Println("Stop ping via channel", p.id)
			return nil
		}
	}
}

func (r *room) gameTimeout() error {
	ticker := time.NewTicker(60 * time.Second)
	defer func() {
		ticker.Stop()
	}()
	select {
	case <-ticker.C:
		oneHour := 1 * time.Hour
		oneHourAgo := time.Now().UTC().Add(-oneHour).UnixMilli()
		if r.Game.Tick > 0 && r.Game.Tick < oneHourAgo {
			log.Println("clearing room, no activity for 1 hour: ", r.Game.Room)
			message, err := NewSendQuit()
			if err != nil {
				return fmt.Errorf(" %w", err)
			}
			r.Hub.broadcast <- message
			message, err = NewSendError(GAME_CLOSED)
			if err != nil {
				return fmt.Errorf(" %w", err)
			}
			r.Hub.broadcast <- message
			store.deleteLogo(r.Game.Room)
			store.deleteRoom(r.Game.Room)
			return nil
		}
	}
	return nil
}

type RegisteredClient struct {
	id       string
	client   *Client
	room     *room
	stopPing chan bool
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
}
