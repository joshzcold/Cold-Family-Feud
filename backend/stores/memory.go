package stores

import (
	"fmt"

	"github.com/joshzcold/Cold-Family-Feud/game"
)

var rooms = make(map[string]game.Game)

type MemoryStore struct{}

func (m MemoryStore) getRoom(roomCode string) (game.Game, error) {
	foundGame, ok := rooms[roomCode]
	if ok {
		return foundGame, nil
	}
	return game.Game{}, fmt.Errorf("Error: could not game of room code: %s", roomCode)
}
