package api

import "fmt"

var store gameStore

// gameStore interface to implement a game store location
// defines functions required to implement the state of the game.
type gameStore interface {
	// List of active rooms on the server
	currentRooms() ([]string) 
	// Game data of room
	getRoom(string) (room, error)
	// Update game data of room
	writeRoom(string, room) error
	// Erase room from server
	deleteRoom(string) error
	// Save an image file for the game logo
	saveLogo(string, []byte) error
	// Load a logo image from room
	loadLogo(string) (string, error)
	// Delete a logo image from room
	deleteLogo(string) error

}

func NewGameStore(gameStore string) error {
	switch gameStore {
	case "memory":
		store = NewMemoryStore()
		return nil
	default:
		return fmt.Errorf("unknown store: %q", gameStore)
	}
}
