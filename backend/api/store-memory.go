package api

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
)

type MemoryStore struct {
	mu    sync.RWMutex
	rooms map[string]room
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		rooms: make(map[string]room),
	}
}

func (m *MemoryStore) currentRooms() []string {
	m.mu.RLock()
	defer m.mu.RUnlock()
	keys := make([]string, len(m.rooms))
	for k := range m.rooms {
		keys = append(keys, k)
	}
	return keys
}

func (m *MemoryStore) getRoom(client *Client, roomCode string) (room, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	foundGame, ok := m.rooms[roomCode]
	if ok {
		return foundGame, nil
	}
	return room{}, errors.New(string(ROOM_NOT_FOUND))
}

func (m *MemoryStore) writeRoom(roomCode string, room room) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.rooms[roomCode] = room
	return nil
}

func (m *MemoryStore) deleteRoom(roomCode string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.rooms, roomCode)
	return nil
}

func (m *MemoryStore) saveLogo(roomCode string, logo []byte) error {
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

func (m *MemoryStore) loadLogo(roomCode string) ([]byte, error) {
	log.Println("Trying to load logo from", "./public/rooms/", roomCode, "logo")
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

func (m *MemoryStore) deleteLogo(roomCode string) error {
	logoPath := filepath.Join(".", "public", "rooms", roomCode, "logo")
	_, err := os.Stat(logoPath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	err = os.Remove(logoPath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil
}
