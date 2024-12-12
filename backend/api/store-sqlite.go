package api

import (
	"encoding/json"
	"fmt"
	"log"
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
	RoomCode string `gorm:"primaryKey"`
	RoomJson datatypes.JSON
	RoomIcon datatypes.NullByte
}

func NewSQLiteStore() (*SQLiteStore, error) {
	db, err := gorm.Open(sqlite.Open("famf.db"), &gorm.Config{})
	if err != nil {
		return &SQLiteStore{}, fmt.Errorf(" %w", err)
	}
	db.AutoMigrate(&Room{})
	return &SQLiteStore{
		db:    db,
		rooms: make(map[string]room),
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

func (s *SQLiteStore) getRoom(roomCode string) (room, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var foundRoomDB Room

	log.Println("Hitting getRoom", roomCode)
	if err := s.db.Where("room_code = ?", roomCode).Find(&foundRoomDB).Error; err != nil {
		return room{}, fmt.Errorf("could not find game of room code: %s", roomCode)
	}
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

	jsonData, err := json.Marshal(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	log.Println("Hitting writeRoom", roomCode)
	result := s.db.Where("room_code = ?", roomCode).Limit(1).Find(&Room{})
	if result.Error != nil {
		newRoom := Room{
			RoomCode: roomCode,
			RoomJson: jsonData,
		}
		s.db.Create(&newRoom)
		return nil
	}
	result.Update("room_json", jsonData)
	return nil
}

func (s *SQLiteStore) deleteRoom(roomCode string) error {
	s.db.Where("room_code = ?", roomCode).Delete(&Room{})
	return nil
}

func (s *SQLiteStore) saveLogo(roomCode string, logo []byte) error {
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_icon", logo)
	return nil
}

func (s *SQLiteStore) loadLogo(roomCode string) ([]byte, error) {
	var logo []byte
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Select("room_icon", &logo)
	return logo, nil
}

func (s *SQLiteStore) deleteLogo(roomCode string) error {
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_icon", nil)
	return nil
}
