package api

import (
	"fmt"
	"log"
	"slices"
	"strconv"
	"strings"
)

func quitPlayer(room *room, client *Client, event *Event) error {
	for idx, b := range room.Game.Buzzed {
		if b.ID == event.ID {
			// Remove from buzzed player list
			room.Game.Buzzed = append(room.Game.Buzzed[:idx], room.Game.Buzzed[idx+1:]...)
		}
	}

	message, err := NewSendQuit()
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	client.stop <- true
	delete(room.Game.RegisteredPlayers, event.ID)
	message, err = NewSendData(room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	return nil
}

func quitHost(room *room, event *Event) error {
	s := store
	// Make everyone else quit
	message, err := NewSendQuit()
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message

	message, err = NewSendError("host quit the game")
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	room.Hub.stop <- true
	// Remove room
	s.deleteRoom(event.Room)
	return nil
}

// Quit clear sessions for user or host
func Quit(client *Client, event *Event) error {
	// TODO clear intervals if I still want those.
	log.Println("user quit game", event.Room, event.ID, event.Host)
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	if event.Host {
		return quitHost(&room, event)
	}
	return quitPlayer(&room, client, event)
}

func JoinRoom(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	playerID := registerPlayer(&room, event.Name)
	message, err := NewSendJoinRoom(room.Game.Room, room.Game, playerID)
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
	message, err := NewSendHostRoom(newRoomCode, initRoom.Game, hostID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	return nil
}

func GetBackIn(client *Client, event *Event) error {
	session := strings.Split(event.Session, ":")
	if len(session) != 3 {
		return fmt.Errorf("session string getting back in not in expected format")
	}
	roomCode, playerID, team := session[0], session[1], session[2]
	s := store
	room, err := s.getRoom(roomCode)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	val, ok := room.Game.RegisteredPlayers[playerID]
	if !ok {
		return fmt.Errorf("player not found in get_back_in")
	}
	teamInt, err := strconv.Atoi(team)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.register <- client
	message, err := NewSendGetBackIn(roomCode, room.Game, playerID, val, teamInt)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	// TODO ping interval if wanted
	return nil
}

func registerPlayer(room *room, playerName string) string {
	playerID := playerID()
	room.Game.RegisteredPlayers[playerID] = registeredPlayer{
		Role: "player",
		Name: playerName,
	}
	log.Println("Registered player in room: ", playerName, playerID, room.Game.Room)
	return playerID
}

// registerHost Set current player as host
func registerHost(room *room) string {
	hostID := playerID()
	room.Game.RegisteredPlayers[hostID] = registeredPlayer{
		Role: "host",
	}
	log.Println("Registered host in room: ", hostID, room.Game.Room)
	store.writeRoom(room.Game.Room, *room)
	return hostID
}
