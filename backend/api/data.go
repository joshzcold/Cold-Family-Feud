package api

import (
	"encoding/json"
	"fmt"
	"log"
)

func mergeGame(game *game, newData *game) {
	game.Round = newData.Round 
	game.FinalRound = newData.FinalRound
	game.FinalRound2 = newData.FinalRound2
	game.HideFirstRound = newData.HideFirstRound
	game.IsFinalRound = newData.IsFinalRound
	game.IsFinalSecond = newData.IsFinalSecond
	game.PointTracker = newData.PointTracker
	game.Settings = newData.Settings
	game.Teams = newData.Teams
	game.Title = newData.Title
	game.TitleText = newData.TitleText
	game.RegisteredPlayers = newData.RegisteredPlayers
}

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
	err = json.Unmarshal(rawData, &newData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	mergeGame(room.Game, &newData)
	log.Println("What is input?", string(newData.FinalRound[0].Input))
	log.Println("What is input?", string(room.Game.FinalRound[0].Input))
	setTick(event)

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
