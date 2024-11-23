package api

import "github.com/google/uuid"
import "math/rand"

const ()

var roomLetterLength = 4
var roomLetters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

// MakeRoom return a room code from random pick of characters of room code length
func RoomCode() string {
	b := make([]rune, roomLetterLength)
	for i := range b {
		b[i] = roomLetters[rand.Intn(len(roomLetters))]
	}
	return string(b)
}

func PlayerID() string {
	return uuid.New().String()
}

type Room struct {
	Game Game `json:"game"`
	// Assign to ws Hub when hosting room
	Hub *Hub
	// Get lag of each client
	Intervals any
}
