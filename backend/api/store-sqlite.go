package api

import (
	"encoding/json"
	"fmt"
	"sync"

	"gorm.io/datatypes"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type SQLiteStore struct {
	// Keep game data in storage
	db *gorm.DB
	// Keep connections and registeredClients in memory
	rooms map[string]room
	mu    sync.RWMutex
}

type Room struct {
	gorm.Model
	RoomCode string
	RoomJson datatypes.JSON
	RoomIcon datatypes.NullByte
}

func NewSQLiteStore() (*SQLiteStore, error) {
	db, err := gorm.Open(sqlite.Open("famf.db"), &gorm.Config{})
	if err != nil {
		return &SQLiteStore{}, fmt.Errorf(" %w", err)
	}
	return &SQLiteStore{
		db: db,
	}, nil
}

func (s *SQLiteStore) currentRooms() []string {
	var rooms []Room
	var roomList []string
	s.db.Select("roomcode").Find(&rooms)

	for _, r := range rooms {
		roomList = append(roomList, r.RoomCode)
	}
	return roomList
}

func (s *SQLiteStore) getRoom(roomCode string) (room, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var foundRoomDB Room
	s.db.Where("roomcode = ?", roomCode).First(&foundRoomDB)
	foundRoom, ok := s.rooms[roomCode]
	if ok {
		json.Unmarshal(foundRoomDB.RoomJson, &foundRoom.Game)
		return foundRoom, nil
	}
	return room{}, fmt.Errorf("could not find game of room code: %s", roomCode)
}

func (s *SQLiteStore) writeRoom(roomCode string, room room) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	var foundRoomDB Room
	s.db.Where("roomcode = ?", roomCode).First(&foundRoomDB)

	_, ok := s.rooms[roomCode]
	if !ok {
		return fmt.Errorf("could not find game of room code: %s", roomCode)
	}
	jsonData, err := json.Marshal(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	s.db.Update("roomjson", jsonData).Where("roomcode = ?", roomCode)
	return nil
}

func (s *SQLiteStore) deleteRoom(roomCode string) error {
	s.db.Where("roomcode = ?", roomCode).Delete(&Room{})
	return nil
}

func (s *SQLiteStore) saveLogo(roomCode string, logo []byte) error {
	s.db.Model(&Room{}).Where("roomcode = ?", roomCode).Update("roomicon", logo)
	return nil
}

func (s *SQLiteStore) loadLogo(roomCode string) ([]byte, error) {
	var logo []byte
	s.db.Model(&Room{}).Where("roomcode = ?", roomCode).Select("roomicon", &logo)
	return logo, nil
}

func (s *SQLiteStore) deleteLogo(roomCode string) error {
	s.db.Model(&Room{}).Where("roomcode = ?", roomCode).Update("roomicon", nil)
	return nil
}
