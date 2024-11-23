package stores

import "github.com/joshzcold/Cold-Family-Feud/game"
import "fmt"

type GameStore interface {
	getRoom() (*game.Game, error)
	writeRoom() error
	deleteRoom() error
	saveLogo() error
	loadLogo() ([]byte, error)
}

func NewGameStore(gameStore string) (interface{}, error) {
	switch gameStore {
	case "memory":
		return MemoryStore{}, nil
	default:
		return nil, fmt.Errorf("unknown store: %q", gameStore)
	}
}
