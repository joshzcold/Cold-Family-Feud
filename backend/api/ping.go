package api

import (
	"fmt"
	"time"
)

func Pong(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	player, ok := room.Game.RegisteredPlayers[event.ID]
	if ! ok {
		return fmt.Errorf("player not found in pong")
	}
	if ! player.Start.IsZero() {
		end := time.Now()
		latency := end.Sub(player.Start)
		for len(player.Latencies) >= 5 {
			player.Latencies = player.Latencies[1:]
		}
		player.Latencies = append(player.Latencies, latency.Milliseconds())
		total := 0
		for l := range player.Latencies {
			total += l
		}
		// Average latency
		player.Latency = float64(total / len(player.Latencies))
	}
	return nil
}
