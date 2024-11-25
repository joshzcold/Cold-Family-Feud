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
	log.Println("Incoming data", string(rawData[:]))
	err = json.Unmarshal([]byte(rawData), &newData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	newData.RegisteredPlayers = make(map[string]registeredPlayer)

	err = json.Unmarshal([]byte(rawData), &room.Game)
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
	message, err := NewSendData(&room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}
