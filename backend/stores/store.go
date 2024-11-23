package stores

import "github.com/joshzcold/Cold-Family-Feud/game"
import "fmt"

var Store GameStore

// GameStore interface to implement a game store location
// defines functions required to implement the state of the game.
type GameStore interface {
	// List of active rooms on the server
	CurrentRooms() ([]string) 
	// Game data of room
	GetRoom(string) (game.Room, error)
	// Update game data of room
	WriteRoom(string, game.Room) error
	// Erase room from server
	DeleteRoom(string) error
	// Save an image file for the game logo
	SaveLogo(string, []byte) error
	// Delete a logo file for a room 
	LoadLogo(string) ([]byte, error)
}

func NewGameStore(gameStore string) error {
	switch gameStore {
	case "memory":
		Store = NewMemoryStore()
		return nil
	default:
		return fmt.Errorf("unknown store: %q", gameStore)
	}
}
