package api

import (
	"encoding/json"
	"fmt"
	"log"
)

func NewData(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	copyRound := room.Game.Round
	newData := game{}
	rawData, err := json.Marshal(event.Data)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	err = json.Unmarshal([]byte(rawData), &newData)
	log.Println(newData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	newData.RegisteredPlayers = make(map[string]*registeredPlayer)

	// TODO how to get in new data without overwriting needed clients/pointers
	err = json.Unmarshal([]byte(rawData), &room.Game)
	for _, player := range room.Game.RegisteredPlayers {
		log.Println(player)
	}

	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	if copyRound != newData.Round {
		room.Game.Buzzed = []buzzed{}
		message, err := NewSendClearBuzzers()
		if err != nil {
			return fmt.Errorf(" %w", err)
		}
		room.Hub.broadcast <- message
	}
	message, err := NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}

func SendUnknown(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	message, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}
