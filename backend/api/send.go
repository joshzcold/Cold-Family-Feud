package api

import (
	"encoding/json"
)

type sendData struct {
	Action string `json:"action"`
	Data   room   `json:"data"`
}

func NewSendData(newGameData room) ([]byte, error) {
	return json.Marshal(sendData{
		Action: "data",
		Data:   newGameData,
	})
}

type sendError struct {
	Action  string `json:"action"`
	Message string `json:"message"`
}

func NewSendError(message string) ([]byte, error) {
	return json.Marshal(sendError{
		Action:  "error",
		Message: message,
	})
}

type sendPing struct {
	Action string `json:"action"`
	Id     string `json:"id"`
}

func NewSendPing(id string) ([]byte, error) {
	return json.Marshal(sendPing{
		Action: "ping",
		Id:     id,
	})
}

type sendHostRoom struct {
	Action string `json:"action"`
	Room   string `json:"room"`
	Game   game   `json:"game"`
	ID     string `json:"id"`
}

func NewSendHostRoom(room string, game game, id string) ([]byte, error) {
	return json.Marshal(sendHostRoom{
		Action: "host_room",
		Room:   room,
		Game:   game,
		ID:     id,
	})
}

type sendJoinRoom struct {
	Action string `json:"action"`
	Room   string `json:"room"`
	Game   room   `json:"game"`
	ID     string `json:"id"`
}

func NewSendJoinRoom(room string, game room, id string) ([]byte, error) {
	return json.Marshal(sendJoinRoom{
		Action: "join_room",
		Room:   room,
		Game:   game,
		ID:     id,
	})
}

type sendQuit struct {
	Action string `json:"action"`
}

func NewSendQuit() ([]byte, error) {
	return json.Marshal(sendQuit{
		Action: "quit",
	})
}

type sendGetBackIn struct {
	Action string           `json:"action"`
	Room   string           `json:"room"`
	Game   room             `json:"game"`
	ID     string           `json:"id"`
	Player registeredPlayer `json:"player"`
	Team   int              `json:"team"`
}

func NewSendGetBackIn(room string, game room, id string, player registeredPlayer, team int) ([]byte, error) {
	return json.Marshal(sendGetBackIn{
		Action: "get_back_in",
		Room:   room,
		Game:   game,
		ID:     id,
		Player: player,
		Team:   team,
	})
}

type sendClearBuzzers struct {
	action string
}

func NewSendClearBuzzers() ([]byte, error) {
	return json.Marshal(sendClearBuzzers{
		action: "clearbuzzers",
	})
}

type sendRegistered struct {
	action string
	id     string
}

func NewSendRegistered(id string) ([]byte, error) {
	return json.Marshal(sendRegistered{
		action: "registered",
		id:     id,
	})
}

type sendChangeLang struct {
	action string
	data   string
	games  []string
}

func NewSendChangeLang(language string, games []string) ([]byte, error) {
	return json.Marshal(sendChangeLang{
		action: "change_lang",
		data:   language,
		games:  games,
	})
}

type sendBuzzed struct {
	action string
}

func NewSendBuzzed() ([]byte, error) {
	return json.Marshal(sendBuzzed{
		action: "buzzed",
	})
}
