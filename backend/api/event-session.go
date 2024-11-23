package api

import (
	"slices"

	"github.com/joshzcold/Cold-Family-Feud/game"
	"github.com/joshzcold/Cold-Family-Feud/stores"
)

// TODO initialize Hub on HostRoom
// TODO join Hub on JoinRoom
// TODO clear hub on Quit

func Quit(client *Client, event *Event) error {
	return nil
}

func JoinRoom(client *Client, event *Event) error {
	return nil
}

func HostRoom(client *Client, event *Event) error {
	newRoomCode := game.RoomCode()
	s := stores.Store
	currentRooms := s.CurrentRooms()
	for slices.Contains(currentRooms, newRoomCode) {
		newRoomCode = game.RoomCode()
	}
	initRoom := game.NewGame(newRoomCode)
	return nil
}

func GetBackIn(client *Client, event *Event) error {
	return nil
}
