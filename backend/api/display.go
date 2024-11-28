package api

import (
	"fmt"
	"strings"
)

func GameWindow(client *Client, event *Event) error {
	session := strings.Split(event.Session, ":")
	if len(session) != 3 {
		return fmt.Errorf("session string game window not in expected format")
	}
	roomCode, _ := session[0], session[1]
	s := store
	room, err := s.getRoom(roomCode)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}

	message, err := NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.register <- client
	room.Hub.broadcast <- message
	return nil
}
