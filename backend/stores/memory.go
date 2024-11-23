package stores

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"github.com/joshzcold/Cold-Family-Feud/game"
)

type MemoryStore struct{
	mu sync.RWMutex
	rooms map[string]game.Room
}

func NewMemoryStore() *MemoryStore{
	return &MemoryStore{
		rooms: make(map[string]game.Room),
	}
}

func (m *MemoryStore) CurrentRooms() []string {
	m.mu.RLock()
	defer m.mu.RUnlock()
	keys := make([]string, len(m.rooms))
	for k := range m.rooms {
		keys = append(keys, k)
	}
	return keys
}

func (m *MemoryStore) GetRoom(roomCode string) (game.Room, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	foundGame, ok := m.rooms[roomCode]
	if ok {
		return foundGame, nil
	}
	return game.Room{}, fmt.Errorf("Error: could not game of room code: %s", roomCode)
}

func (m *MemoryStore) WriteRoom(roomCode string, game game.Room) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.rooms[roomCode] = game
	return nil
}

func (m *MemoryStore) DeleteRoom(roomCode string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.rooms, roomCode)
	return nil
}

func (m *MemoryStore) SaveLogo(roomCode string, logo []byte) error {
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

func (m *MemoryStore) LoadLogo(roomCode string) ([]byte, error) {
	logoPath := filepath.Join(".", "public", "rooms", roomCode, "logo")
	_, err := os.Stat(logoPath)
	if err != nil {
		return nil, fmt.Errorf(" %w", err)
	}
	logo, err := os.ReadFile(logoPath)
	if err != nil {
		return nil, fmt.Errorf(" %w", err)
	}
	return logo, nil
}
