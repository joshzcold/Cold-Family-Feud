package game

import "time"

type RegisteredPlayer struct {
	Start     time.Time `json:"start"`
	Latencies []float64 `json:"latencies"`
	Team      string    `json:"team"`
	Latency   float64   `json:"latency"`
}

type Buzzed struct {
	Time time.Time `json:"time"`
	ID   string    `json:"id"`
}

type Settings struct {
	LogoUrl         interface{} `json:"logo_url"`
	HideQuestions   bool        `json:"hide_questions"`
	Theme           string      `json:"theme"`
	FinalRoundTitle interface{} `json:"final_round_title"`
}

type Team struct {
	Name     string `json:"name"`
	Points   int    `json:"points"`
	Mistakes int    `json:"mistakes"`
}

type Game struct {
	RegisteredPlayers map[string]*RegisteredPlayer `json:"registeredPlayers"`
	Buzzed            []*Buzzed                    `json:"buzzed"`
	Settings          *Settings                    `json:"settings"`
	Teams             []*Team                      `json:"teams"`
	Title             bool                         `json:"title"`
	TitleText         string                       `json:"title_text"`
	PointTracker      []interface{}                `json:"point_tracker"`
	IsFinalRound      bool                         `json:"is_final_round"`
	IsFinalSecond     bool                         `json:"is_final_second"`
	HideFirstRound    bool                         `json:"hide_first_round"`
	Round             int                          `json:"round"`
}
