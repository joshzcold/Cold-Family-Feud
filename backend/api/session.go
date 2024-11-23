package api

import (
	"fmt"
	"log"
	"slices"
)

// TODO initialize Hub on HostRoom
// TODO join Hub on JoinRoom
// TODO clear hub on Quit

func Quit(client *Client, event *Event) error {
	return nil
}

func JoinRoom(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	playerID := registerPlayer(&room, event.Name)
	message, err := NewSendJoinRoom(room.game.Room, room.game, playerID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	return nil
}

// HostRoom create new room and websocket hub
func HostRoom(client *Client, event *Event) error {
	newRoomCode := roomCode()
	s := store
	currentRooms := s.currentRooms()
	for slices.Contains(currentRooms, newRoomCode) {
		newRoomCode = roomCode()
	}
	initRoom := NewGame(newRoomCode)
	hostID := registerHost(&initRoom)
	initRoom.Hub = NewHub()
	go initRoom.Hub.run()
	initRoom.Hub.register <- client
	message, err := NewSendHostRoom(newRoomCode, initRoom.game, hostID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	return nil
}

func GetBackIn(client *Client, event *Event) error {
	return nil
}

func registerPlayer(room *room, playerName string) string {
	playerID := playerID()
	room.game.RegisteredPlayers[playerID] = registeredPlayer{
		Role: "player",
		Name: playerName,
	}
	log.Println("Registered player in room: ", playerName, playerID, room.game.Room)
	return playerID
}

// registerHost Set current player as host
func registerHost(room *room) string {
	hostID := playerID()
	room.game.RegisteredPlayers[hostID] = registeredPlayer{
		Role: "host",
	}
	log.Println("Registered host in room: ", hostID, room.game.Room)
	store.writeRoom(room.game.Room, *room)
	return hostID
}
