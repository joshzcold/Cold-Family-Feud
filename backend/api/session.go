package api

import (
	"fmt"
	"log"
	"slices"
	"strings"
)

func quitPlayer(room *room, client *Client, event *Event) error {
	for idx, b := range room.Game.Buzzed {
		if b.ID == event.ID {
			// Remove from buzzed player list
			room.Game.Buzzed = append(room.Game.Buzzed[:idx], room.Game.Buzzed[idx+1:]...)
		}
	}

	playerClient, ok := room.registeredClients[event.ID]
	if ok && playerClient.stopPing != nil {
		// clear interval
		playerClient.stopPing <- true
	}
	message, err := NewSendQuit()
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	playerClient.client.send <- message
	playerClient.client.stop <- true
	delete(room.Game.RegisteredPlayers, event.ID)
	message, err = NewSendData(room.Game)
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
	s.deleteLogo(event.Room)
	return nil
}

// Quit clear sessions for user or host
func Quit(client *Client, event *Event) error {
	log.Println("user quit game", event.Room, event.ID, event.Host)
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	if event.Host {
		return quitHost(&room, event)
	}
	err = quitPlayer(&room, client, event)
	s.writeRoom(room.Game.Room, room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil
}

func JoinRoom(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	playerID := registerPlayer(&room, event.Name, client)
	room.Hub.register <- client
	message, err := NewSendJoinRoom(room.Game.Room, room.Game, playerID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	s.writeRoom(event.Room, room)
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
	go initRoom.gameTimeout()
	initRoom.Hub.register <- client
	message, err := NewSendHostRoom(newRoomCode, initRoom.Game, hostID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	s.writeRoom(newRoomCode, initRoom)
	return nil
}

func getBackInHost(client *Client, room room, roomCode string, playerID string) error {
	room.Hub.register <- client
	message, err := NewSendGetBackIn(roomCode, room.Game, playerID, registeredPlayer{}, true)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	return nil
}

func getBackInPlayer(client *Client, room room, roomCode string, playerID string) error {
	player, ok := room.Game.RegisteredPlayers[playerID]
	if !ok {
		return fmt.Errorf("player not found in get_back_in")
	}
	room.Hub.register <- client
	message, err := NewSendGetBackIn(roomCode, room.Game, playerID, *player, false)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message

	playerClient, ok := room.registeredClients[playerID]
	if ok {
		if playerClient.stopPing != nil {
			playerClient.stopPing <- true
		}
		// Set up recurring ping loop to get player latency
		playerClient = &RegisteredClient{
			id:     playerID,
			client: client,
			room:   &room,
			stopPing:   make(chan bool),
		}
		go playerClient.pingInterval()
	}
	return nil
}

func GetBackIn(client *Client, event *Event) error {
	session := strings.Split(event.Session, ":")
	if len(session) < 2 {
		return fmt.Errorf("session string %q getting back in not in expected format", session)
	}
	roomCode, playerID := session[0], session[1]
	s := store
	room, err := s.getRoom(roomCode)
	if err != nil {
		return nil
	}
	if playerID == room.Game.Host.ID {
		return getBackInHost(client, room, roomCode, playerID)
	}
	return getBackInPlayer(client, room, roomCode, playerID)
}

func registerPlayer(room *room, playerName string, client *Client) string {
	playerID := playerID()
	room.Game.RegisteredPlayers[playerID] = &registeredPlayer{
		Name: playerName,
	}
	room.registeredClients[playerID] = &RegisteredClient{
		id: playerID,
		client: client,
		room: room,
	}
	log.Println("Registered player in room: ", playerName, playerID, room.Game.Room)

	return playerID
}

// registerHost Set current player as host
func registerHost(room *room) string {
	hostID := playerID()
	room.Game.Host = host{
		ID: hostID,
	}
	log.Println("Registered host in room: ", hostID, room.Game.Room)
	store.writeRoom(room.Game.Room, *room)
	return hostID
}
