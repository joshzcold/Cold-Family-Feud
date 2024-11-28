package api

import (
	"fmt"
	"time"
)

func ClearBuzzers(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
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
	room, err := s.getRoom(event.Room)
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

	if player.Ping.stop != nil {
		player.Ping.stop <- true
	}
	// Set up recurring ping loop to get player latency
	player.Ping = PingInterval {
		id: event.ID,
		client: client,
		room: &room,
		stop: make(chan bool),
	}
	go player.Ping.pingInterval()
	s.writeRoom(room.Game.Room, room)
	return nil
}

func Buzz(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if !ok {
		return fmt.Errorf("player not found in buzz function")
	}
	latencyDuration := time.Millisecond * time.Duration(player.Latency)
	time := time.Now().Add(-time.Millisecond * latencyDuration)
	if len(room.Game.Buzzed) == 0 {
		room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
			ID:   event.ID,
			Time: time,
		})
	} else {
		for idx, buz := range room.Game.Buzzed {
			if buz.Time.Before(time) && idx == len(room.Game.Buzzed)-1 {
				room.Game.Buzzed = append(room.Game.Buzzed, buzzed{
					ID:   event.ID,
					Time: time,
				})
			} else {
				room.Game.Buzzed = append(room.Game.Buzzed[:idx], room.Game.Buzzed[idx+1:]...)
				break
			}
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
	return nil
}

func RegisterSpectator(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.ID)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
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
	room.Hub.register <- client
	room.Hub.broadcast <- message
	return nil
}
