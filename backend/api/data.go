package api

import (
	"encoding/json"
	"fmt"
)

func NewData(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	copyRound := room.Game.Round
	copyTitle := room.Game.Title
	newData := game{}
	json.Unmarshal([]byte(fmt.Sprint(event.Data)), &newData)
	newData.RegisteredPlayers = make(map[string]registeredPlayer)
	// TODO clone?
	// game = clone
	if copyRound != newData.Round || copyTitle != newData.Title {
		newData.Buzzed = []buzzed{}
		message, err := NewSendClearBuzzers()
		if err != nil {
			return fmt.Errorf(" %w", err)
		}
		room.Hub.broadcast <- message
	}
	message, err := NewSendData(&newData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}
