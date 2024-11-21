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

var recieveActions = map[string]func(client *Client, event *Event) error {
	"load_game": LoadGame,
	"host_room": HostRoom,
	"game_window": GameWindow,
	"join_room": JoinRoom,
	"quit": Quit,
	"get_back_in": GetBackIn,
	"data": NewData,
	"registerbuzz": RegisterBuzzer,
	"registerspectator":  RegisterSpectator,
	"pong": Pong,
	"clearbuzzers": ClearBuzzers,
	"change_lang": ChangeLanguage,
	"buzz": Buzzed,
	"logo_upload": LogoUpload,
	"del_logo_upload": DeleteLogoUpload,
}

// TODO map each of these to a data type
var sendActions = map[string]interface{} {
	"data": "",
	"error": "",
	"ping": "",
	"host_room": "",
	"join_room": "",
	"quit": "",
	"get_back_in": "",
	"clearbuzzers": "",
	"registered": "",
	"change_lang": "",
	"buzzed": "",
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
