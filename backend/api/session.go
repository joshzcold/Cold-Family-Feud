package api

import (
	"slices"
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
	newRoomCode := RoomCode()
	s := Store
	currentRooms := s.CurrentRooms()
	for slices.Contains(currentRooms, newRoomCode) {
		newRoomCode = RoomCode()
	}
	initRoom := NewGame(newRoomCode)
	registerHost(&initRoom)
	initRoom.Hub = NewHub()
	go initRoom.Hub.run()
	return nil
}

func GetBackIn(client *Client, event *Event) error {
	return nil
}

func registerPlayer(room *Room, player string) {
	room.Game.RegisteredPlayers[PlayerID()] = registeredPlayer{
		Role: "player",
		Name: player,
	}
}

// registerHost Set current player as host
func registerHost(room *Room) {
	room.Game.RegisteredPlayers[PlayerID()] = registeredPlayer{
		Role: "host",
	}
}
