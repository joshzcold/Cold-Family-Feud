package api

import "time"

type registeredPlayer struct {
	Start     time.Time `json:"start"`
	Latencies []int64   `json:"latencies"`
	Team      int       `json:"team"`
	Latency   float64   `json:"latency"`
	Role      string    `json:"role"`
	Name      string    `json:"name"`
	Ping      PingInterval `json:"ping"`
}

type buzzed struct {
	Time time.Time `json:"time"`
	ID   string    `json:"id"`
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

type answer struct {
	Triggered bool   `json:"trig"`
	Answer    string `json:"ans"`
	Points    int    `json:"pnt"`
}

type round struct {
	Answers  []answer `json:"answers"`
	Multiply int      `json:"multiply"`
	Question string   `json:"question"`
}

type finalRound struct {
	Answers   []any  `json:"answers"`
	Questions string `json:"question"`
	Selection int    `json:"selection"`
	Points    int    `json:"points"`
	Input     string `json:"input"`
	Revealed  bool   `json:"revealed"`
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
	Rounds            []round                     `json:"rounds"`
	FinalRound        []finalRound                `json:"final_round"`
	FinalRoundTimers  []int                       `json:"final_round_timers"`
}

func NewGame(roomCode string) room {
	return room{
		Hub: nil,
		Game: game{
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
