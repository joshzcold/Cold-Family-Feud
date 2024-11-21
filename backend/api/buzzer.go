package api

import (
	"fmt"
	"time"
)

func ClearBuzzers(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(client, event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Game.Buzzed = []buzzed{}
	message, err := NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	message, err = NewSendClearBuzzers()
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	s.writeRoom(room.Game.Room, room)
	return nil
}

func RegisterBuzzer(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(client, event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if !ok {
		return fmt.Errorf("player not found in register buzzer")
	}
	player.Team = event.Team
	player.Start = time.Now()
	message, err := NewSendPing(event.ID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	message, err = NewSendRegistered(event.ID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	message, err = NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	s.writeRoom(room.Game.Room, room)

	clientPlayer, ok := room.registeredClients[event.ID]
	if !ok {
		return fmt.Errorf("player client not found in register buzzer")
	}
	// Set up recurring ping loop to get player latency
	clientPlayer.stopPing = make(chan bool)
	go clientPlayer.pingInterval()
	s.writeRoom(room.Game.Room, room)
	return nil
}

func Buzz(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(client, event.Room)
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if !ok {
		return fmt.Errorf("player not found in buzz function")
	}
	latencyMilliseconds := time.Millisecond * time.Duration(player.Latency)
	latencyTime := time.Now().UTC().Add(-latencyMilliseconds).UnixMilli()
	if len(room.Game.Buzzed) == 0 {
		room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
			ID:   event.ID,
			Time: latencyTime,
		})
	} else {
		for idx, buz := range room.Game.Buzzed {
			if buz.Time < latencyTime {
				room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
					ID:   event.ID,
					Time: latencyTime,
				})
				break
			}
			// Prepend to buzzed list since this buzzed was faster
			toAppend := []buzzed{{
				ID:   event.ID,
				Time: latencyTime,
			}}
			room.Game.Buzzed = append(toAppend, room.Game.Buzzed[idx+1:]...)
			break
		}
	}
	message, err := NewSendBuzzed()
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	client.send <- message
	message, err = NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.broadcast <- message
	s.writeRoom(event.Room, room)
	return nil
}

func RegisterSpectator(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(client, event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	delete(room.Game.RegisteredPlayers, event.ID)
	message, err := NewSendData(room.Game)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	room.Hub.register <- client
	room.Hub.broadcast <- message
	return nil
}
