package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"gorm.io/datatypes"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type SQLiteStore struct {
	// Keep game data in storage
	db *gorm.DB
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
	var foundRoomDB Room

	log.Println("Hitting getRoom", roomCode)
	if err := s.db.Where("room_code = ?", roomCode).First(&foundRoomDB).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return room{}, fmt.Errorf("could not find game of room code: %s in database", roomCode)
	}
	// TODO how to store only game data in the store, but then also put other state data
	// like clients in memory.
	retrievedRoom := room{}
	json.Unmarshal(foundRoomDB.RoomJson, &retrievedRoom.Game)
	return retrievedRoom, nil
}

func (s *SQLiteStore) writeRoom(roomCode string, room room) error {
	jsonData, err := json.Marshal(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	log.Println("Hitting writeRoom", roomCode)
	if err := s.db.Where("room_code = ?", roomCode).First(&Room{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		newRoom := Room{
			RoomCode: roomCode,
			RoomJson: jsonData,
		}
		s.db.Create(&newRoom)
		return nil
	}
	s.db.Model(&Room{}).Where("room_code = ?", roomCode).Update("room_json", jsonData)
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
