package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"sync"

	"gorm.io/datatypes"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type SQLiteStore struct {
	// Keep game data in storage
	db    *gorm.DB
	rooms map[string]roomConnections
	mu    sync.RWMutex
}

type Room struct {
	gorm.Model
	RoomCode string `gorm:"primaryKey"`
	RoomJson datatypes.JSON
	RoomIcon []byte
}

func NewSQLiteStore() (*SQLiteStore, error) {
	storePath := "famf.db"
	if envPath := os.Getenv("GAME_STORE_SQLITE_PATH"); envPath != "" {
		storePath = envPath
	}
	log.Println("Using sqlite store path", storePath)
	db, err := gorm.Open(sqlite.Open(storePath), &gorm.Config{})
	if err != nil {
		return &SQLiteStore{}, fmt.Errorf(" %w", err)
	}
	db.AutoMigrate(&Room{})
	return &SQLiteStore{
		db:    db,
		rooms: make(map[string]roomConnections),
	}, nil
}

func (s *SQLiteStore) currentRooms() []string {
	var rooms []Room
	var roomList []string
	s.db.Model(&Room{}).Select("room_code").Find(&rooms)

	for _, r := range rooms {
		roomList = append(roomList, r.RoomCode)
	}
	return roomList
}

func (s *SQLiteStore) getRoom(client *Client, roomCode string) (room, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var foundRoomDB Room

	if err := s.db.Where("room_code = ?", roomCode).First(&foundRoomDB).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return room{}, fmt.Errorf("could not find game of room code: %s in database", roomCode)
	}
	_, ok := s.rooms[roomCode]

	// Reattach to the game creating a new hub
	if !ok && roomCode != "" {
		log.Println("getRoom recreating roomConnections map")
		initRoom := InitalizeRoom(client, roomCode)
		s.rooms[roomCode] = initRoom.roomConnections
	}

	foundRoom, _ := s.rooms[roomCode]
	retrievedRoom := room{
		Game: &game{},
		roomConnections: roomConnections{
			Hub:               foundRoom.Hub,
			registeredClients: foundRoom.registeredClients,
		},
	}
	json.Unmarshal(foundRoomDB.RoomJson, &retrievedRoom.Game)

	return retrievedRoom, nil
}

func (s *SQLiteStore) writeRoom(roomCode string, room room) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	jsonData, err := json.Marshal(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	if err := s.db.Where("room_code = ?", roomCode).First(&Room{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		newRoom := Room{
			RoomCode: roomCode,
			RoomJson: jsonData,
		}
		s.db.Create(&newRoom)
		s.rooms[roomCode] = room.roomConnections
		return nil
	}
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_json", jsonData)
	s.rooms[roomCode] = room.roomConnections
	return nil
}

func (s *SQLiteStore) deleteRoom(roomCode string) error {
	log.Println("Try to delete room", roomCode)
	s.db.Unscoped().Where("room_code = ?", roomCode).Delete(&Room{})
	return nil
}

func (s *SQLiteStore) saveLogo(roomCode string, logo []byte) error {
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_icon", logo)
	return nil
}

func (s *SQLiteStore) loadLogo(roomCode string) ([]byte, error) {
	var foundRoomDB Room

	if err := s.db.Where("room_code = ?", roomCode).First(&foundRoomDB).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return foundRoomDB.RoomIcon, nil
}

func (s *SQLiteStore) deleteLogo(roomCode string) error {
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_icon", nil)
	return nil
}
