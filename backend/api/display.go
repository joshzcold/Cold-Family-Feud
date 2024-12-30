package api

import (
	"fmt"
	"strings"
)

func GameWindow(client *Client, event *Event) GameError {
	session := strings.Split(event.Session, ":")
	if len(session) < 2 {
		return GameError{code: "INVALID_SESSION_FORMAT", message: "Session must be in format 'roomCode:id' or 'roomCode:id:0' for spectators"}
	}

	roomCode := session[0]
	if roomCode == "" {
		return GameError{code: "INVALID_ROOM", message: "Room code cannot be empty"}
	}

	s := store
	room, storeError := s.getRoom(client, roomCode)
	if storeError.code != "" {
		return storeError
	}

	message, err := NewSendData(room.Game)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.register <- client
	room.Hub.broadcast <- message
	return GameError{}
}
