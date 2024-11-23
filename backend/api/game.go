package api

import "time"

type registeredPlayer struct {
	Start     time.Time `json:"start"`
	Latencies []float64 `json:"latencies"`
	Team      string    `json:"team"`
	Latency   float64   `json:"latency"`
	Role      string    `json:"role"`
	Name      string    `json:"name"`
}

type buzzed struct {
	Time time.Time `json:"time"`
	Id   string    `json:"id"`
}

type settings struct {
	LogoUrl         any    `json:"logo_url"`
	HideQuestions   bool   `json:"hide_questions"`
	Theme           string `json:"theme"`
	FinalRoundTitle any    `json:"final_round_title"`
}

type team struct {
	Name     string `json:"name"`
	Points   int    `json:"points"`
	Mistakes int    `json:"mistakes"`
}

type game struct {
	Room              string                      `json:"room"`
	RegisteredPlayers map[string]registeredPlayer `json:"registeredPlayers"`
	Buzzed            []buzzed                    `json:"buzzed"`
	Settings          settings                    `json:"settings"`
	Teams             []team                      `json:"teams"`
	Title             bool                        `json:"title"`
	TitleText         string                      `json:"title_text"`
	PointTracker      []interface{}               `json:"point_tracker"`
	IsFinalRound      bool                        `json:"is_final_round"`
	IsFinalSecond     bool                        `json:"is_final_second"`
	HideFirstRound    bool                        `json:"hide_first_round"`
	Round             int                         `json:"round"`
}
func NewGame(roomCode string) room {
	return room{
		Hub: nil,
		game: game{
			Room:              roomCode,
			RegisteredPlayers: make(map[string]registeredPlayer),
			Buzzed:            []buzzed{},
			Settings: settings{
				LogoUrl:         nil,
				HideQuestions:   true,
				Theme:           "default",
				FinalRoundTitle: nil,
			},
			Teams: []team{
				{
					Name:     "Team 1",
					Points:   0,
					Mistakes: 0,
				},
				{
					Name:     "Team 2",
					Points:   0,
					Mistakes: 0,
				},
			},
			Title:          true,
			TitleText:      "",
			PointTracker:   []any{},
			IsFinalRound:   false,
			IsFinalSecond:  false,
			HideFirstRound: false,
			Round:          0,
		},
	}
}
