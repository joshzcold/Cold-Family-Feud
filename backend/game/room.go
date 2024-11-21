package game

import "math/rand"
import "github.com/joshzcold/Cold-Family-Feud/ws"

const ()

var roomLetterLength = 4
var roomLetters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

// MakeRoom return a room code from random pick of characters of room code length
func MakeRoom() string {
	b := make([]rune, roomLetterLength)
	for i := range b {
		b[i] = roomLetters[rand.Intn(len(roomLetters))]
	}
	return string(b)
}

type Room struct {
    // Connections map[string]*Client
}

type Rooms map[string]*Room
