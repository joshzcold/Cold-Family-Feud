package api

import (
	"encoding/json"
	"log"
)

type Event struct {
	Action string      `json:"action"`
	File   string      `json:"file"`
	Lang   string      `json:"lang"`
	Data   interface{} `json:"data"`
	Room   string      `json:"room"`
}

type ActionFunc func(*Client, *Event) error

var recieveActions = map[string]func(client *Client, event *Event) error{
	"buzz":              Buzzed,
	"change_lang":       ChangeLanguage,
	"clearbuzzers":      ClearBuzzers,
	"data":              NewData,
	"del_logo_upload":   DeleteLogoUpload,
	"game_window":       GameWindow,
	"get_back_in":       GetBackIn,
	"host_room":         HostRoom,
	"join_room":         JoinRoom,
	"load_game":         LoadGame,
	"logo_upload":       LogoUpload,
	"pong":              Pong,
	"quit":              Quit,
	"registerbuzz":      RegisterBuzzer,
	"registerspectator": RegisterSpectator,
}

func parseEvent(message []byte) (*Event, error) {
	var event *Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		return nil, err
	}
	return event, nil
}

func EventPipe(client *Client, message []byte) error {
	event, err := parseEvent(message)
	if err != nil {
		return err
	}
	log.Printf("Event: %+v\n", event)
	return nil
}
