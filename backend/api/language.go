package api

import (
	"fmt"
	"path/filepath"
)

func ChangeLanguage(client *Client, event *Event) error {
	gamePath := filepath.Join("games", fmt.Sprint(event.Data), "**/*.json")
	gameList, err := filepath.Glob(gamePath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	message, err := NewSendChangeLang(fmt.Sprint(event.Data), gameList)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}
