package api

import (
	"errors"
	"fmt"
	"time"
)

func Pong(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(client, event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if ! ok {
		return errors.New(string(PLAYER_NOT_FOUND))
	}
	if ! player.Start.IsZero() {
		end := time.Now()
		latency := end.Sub(player.Start)
		for len(player.Latencies) >= 5 {
			player.Latencies = player.Latencies[1:]
		}
		player.Latencies = append(player.Latencies, latency.Milliseconds())
		var total int64
		for _, val := range player.Latencies {
			total += val
		}
		// Average latency
		player.Latency = float64(total / int64(len(player.Latencies)))
	}
	return nil
}
