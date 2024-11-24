package api

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// addGameKeys Add state data to a loaded game
func addGameKeys(game *game) error {
	if len(game.Rounds) == 0 {
		return fmt.Errorf("invalid game: loaded game missing rounds")
	}
	for _, round := range game.Rounds {
		if len(round.Answers) == 0 {
			return fmt.Errorf("invalid game: round %q is missing answers", round.Question)
		}
		for _, answer := range round.Answers {
			answer.Triggered = false
		}
	}
	if len(game.FinalRound) > 0 {
		for _, round := range game.FinalRound {
			round.Selection = -1
			round.Points = 0
			round.Input = ""
			round.Revealed = false
		}
	}
	return nil
}

func LoadGame(client *Client, event *Event) error {
	s := store
	room, err := s.getRoom(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	filePath := filepath.Join("games", event.Lang, event.File)
	_, err = os.Stat(filePath)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	gameBytes, err := os.ReadFile(filePath)
	loadedGame := room.game
	json.Unmarshal(gameBytes, &loadedGame)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	err = addGameKeys(&loadedGame)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil

}
