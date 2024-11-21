package api

import (
	"fmt"
	"path/filepath"

	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

func ChangeLanguage(client *Client, event *Event) error {
	gamePath := filepath.Join("games", fmt.Sprint(event.Data), "**/*.json")
	gameList, err := filepath.Glob(gamePath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	s := store
	room, err := s.getRoom(client, event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	cull := collate.New(
		language.English,
		collate.IgnoreCase,
		collate.IgnoreDiacritics,
		collate.IgnoreWidth,
		collate.Loose,
		collate.Force,
		collate.Numeric,
	)
	cull.SortStrings(gameList)
	message, err := NewSendChangeLang(fmt.Sprint(event.Data), gameList)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}
