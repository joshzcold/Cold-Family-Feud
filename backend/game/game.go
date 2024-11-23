package game

import "time"

type RegisteredPlayer struct {
	start     time.Time `json:"start"`
	latencies []float64 `json:"latencies"`
	team      string    `json:"team"`
	latency   float64   `json:"latency"`
}

type Buzzed struct {
	time time.Time `json:"time"`
	id   string    `json:"id"`
}

type Settings struct {
	logoUrl         any    `json:"logo_url"`
	hideQuestions   bool   `json:"hide_questions"`
	theme           string `json:"theme"`
	finalRoundTitle any    `json:"final_round_title"`
}

type Team struct {
	name     string `json:"name"`
	points   int    `json:"points"`
	mistakes int    `json:"mistakes"`
}

type Game struct {
	room              string                      `json:"room"`
	registeredPlayers map[string]RegisteredPlayer `json:"registeredPlayers"`
	buzzed            []Buzzed                    `json:"buzzed"`
	settings          Settings                    `json:"settings"`
	teams             []Team                      `json:"teams"`
	title             bool                        `json:"title"`
	titleText         string                      `json:"title_text"`
	pointTracker      []interface{}               `json:"point_tracker"`
	isFinalRound      bool                        `json:"is_final_round"`
	isFinalSecond     bool                        `json:"is_final_second"`
	hideFirstRound    bool                        `json:"hide_first_round"`
	round             int                         `json:"round"`
}

type Room struct {
	game Game `json:"game"`
	// Assign to ws Hub when hosting room
	hub any
	// Get lag of each client
	intervals any
}

func NewGame(roomCode string) Room {
	return Room{
		hub: nil,
		game: Game{
			room:              roomCode,
			registeredPlayers: make(map[string]RegisteredPlayer),
			buzzed:            []Buzzed{},
			settings: Settings{
				logoUrl:         nil,
				hideQuestions:   true,
				theme:           "default",
				finalRoundTitle: nil,
			},
			teams: []Team{
				Team{
					name:     "Team 1",
					points:   0,
					mistakes: 0,
				},
				Team{
					name:     "Team 2",
					points:   0,
					mistakes: 0,
				},
			},
			title:          true,
			titleText:      "",
			pointTracker:   []any{},
			isFinalRound:   false,
			isFinalSecond:  false,
			hideFirstRound: false,
			round:          0,
		},
	}
}
