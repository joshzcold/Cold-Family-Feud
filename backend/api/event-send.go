package api

import "github.com/joshzcold/Cold-Family-Feud/game"

type sendData struct {
	action string
	data   game.Game
}

func NewSendData(newGameData game.Game) sendData {
	return sendData{
		action: "data",
		data:   newGameData,
	}
}

type sendError struct {
	action  string
	message string
}

func NewSendError(message string) sendError {
	return sendError{
		action:  "error",
		message: message,
	}
}

type sendPing struct {
	action string
	id     string
}

func NewSendPing(id string) sendPing {
	return sendPing{
		action: "ping",
		id:     id,
	}
}

type sendHostRoom struct {
	action string
	room   string
	game   game.Game
	id     string
}

func NewSendHostRoom(room string, game game.Game, id string) sendHostRoom {
	return sendHostRoom{
		action: "host_room",
		room:   room,
		game:   game,
		id:     id,
	}
}

type sendJoinRoom struct {
	action string
	room   string
	game   game.Game
	id     string
}

func NewSendJoinRoom(room string, game game.Game, id string) sendJoinRoom {
	return sendJoinRoom{
		action: "join_room",
		room:   room,
		game:   game,
		id:     id,
	}
}

type sendQuit struct {
	action string
}

func NewSendQuit() sendQuit {
	return sendQuit{
		action: "quit",
	}
}

type sendGetBackIn struct {
	action string
	room   string
	game   game.Game
	id     string
	player game.RegisteredPlayer
	team   int
}

func NewSendGetBackIn(room string, game game.Game, id string, player game.RegisteredPlayer, team int) sendGetBackIn {
	return sendGetBackIn{
		action: "get_back_in",
		room:   room,
		game:   game,
		id:     id,
		player: player,
		team:   team,
	}
}

type sendClearBuzzers struct {
	action string
}

func NewSendClearBuzzers() sendClearBuzzers {
	return sendClearBuzzers{
		action: "clearbuzzers",
	}
}

type sendRegistered struct {
	action string
	id     string
}

func NewSendRegistered(id string) sendRegistered {
	return sendRegistered{
		action: "registered",
		id:     id,
	}
}

type sendChangeLang struct {
	action string
	data   string
	games  []string
}

func NewSendChangeLang(language string, games []string) sendChangeLang {
	return sendChangeLang{
		action: "change_lang",
		data:   language,
		games:  games,
	}
}

type sendBuzzed struct {
	action string
}

func NewSendBuzzed() sendBuzzed {
	return sendBuzzed{
		action: "buzzed",
	}
}
