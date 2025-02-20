package api

import (
	"fmt"
	"time"
)

func ClearBuzzers(client *Client, event *Event) GameError {
	s := store
	room, storeError := s.getRoom(client, event.Room)
	if storeError.code != "" {
		return storeError
	}
	room.Game.Buzzed = []buzzed{}
	message, err := NewSendData(room.Game)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.broadcast <- message
	message, err = NewSendClearBuzzers()
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.broadcast <- message
	s.writeRoom(room.Game.Room, room)
	return GameError{}
}

func RegisterBuzzer(client *Client, event *Event) GameError {
	s := store
	room, storeError := s.getRoom(client, event.Room)
	if storeError.code != "" {
		return storeError
	}
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if !ok {
		return GameError{code: PLAYER_NOT_FOUND}
	}
	player.Team = event.Team
	player.Start = time.Now()
	message, err := NewSendRegistered(event.ID)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	client.send <- message
	message, err = NewSendData(room.Game)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.broadcast <- message
	s.writeRoom(room.Game.Room, room)
	return GameError{}
}

func Buzz(client *Client, event *Event) GameError {
	s := store
	room, storeError := s.getRoom(client, event.Room)
	if storeError.code != "" {
		return storeError
	}
	_, ok := room.Game.RegisteredPlayers[event.ID]
	if !ok {
		return GameError{code: PLAYER_NOT_FOUND}
	}
	buzzTime := time.Now().UTC().UnixMilli()
	if len(room.Game.Buzzed) == 0 {
		room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
			ID:   event.ID,
			Time: buzzTime,
		})
	} else {
		for idx, buz := range room.Game.Buzzed {
			if buz.Time < buzzTime {
				room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
					ID:   event.ID,
					Time: buzzTime,
				})
				break
			}
			// Prepend to buzzed list since this buzzed was faster
			toAppend := []buzzed{{
				ID:   event.ID,
				Time: buzzTime,
			}}
			room.Game.Buzzed = append(toAppend, room.Game.Buzzed[idx+1:]...)
		}
	}
	message, err := NewSendBuzzed()
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	client.send <- message
	message, err = NewSendData(room.Game)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.broadcast <- message
	s.writeRoom(event.Room, room)
	return GameError{}
}

func RegisterSpectator(client *Client, event *Event) GameError {
	s := store
	room, storeError := s.getRoom(client, event.Room)
	if storeError.code != "" {
		return storeError
	}
	delete(room.Game.RegisteredPlayers, event.ID)
	message, err := NewSendData(room.Game)
	if err != nil {
		return GameError{code: SERVER_ERROR, message: fmt.Sprint(err)}
	}
	room.Hub.register <- client
	room.Hub.broadcast <- message
	return GameError{}
}
