package stores

import (
	"fmt"
	"math"
	"net/http"
	"os"
	"path/filepath"

	"github.com/joshzcold/Cold-Family-Feud/game"
)

var rooms = make(map[string]*game.Game)

type MemoryStore struct{}

func (m MemoryStore) getRoom(roomCode string) (game.Game, error) {
	foundGame, ok := *rooms[roomCode]
	if ok {
		return *foundGame, nil
	}
	return game.Game{}, fmt.Errorf("Error: could not game of room code: %s", roomCode)
}

func (m MemoryStore) writeRoom(roomCode string, game *game.Game) error {
	*rooms[roomCode] = game
	return nil
}

func (m MemoryStore) deleteRoom(roomCode string) error {
	delete(*rooms, roomCode)
	return nil
}

func (m MemoryStore) saveLogo(roomCode string, logo []byte) error {
	dirPath := filepath.Join(".", "public", "rooms", roomCode)
	err := VerifyLogo(logo)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	err = os.MkdirAll(dirPath, os.ModePerm)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}

	err = os.WriteFile(filepath.Join(dirPath, "logo"), logo, 0644)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil
}

func (m MemoryStore) loadLogo(roomCode string) ([]byte, error) {
	logoPath := filepath.Join(".", "public", "rooms", roomCode, "logo")
	_, err := os.Stat(logoPath)
	if err != nil {
		return nil, fmt.Errorf(" %w", err)
	}
	logo, err := os.ReadFile(logoPath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return logo nil
}
