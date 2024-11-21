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

// var events = map[string]interface{}{
// 	"load_game": 
// }

func parseEvent(message []byte) (*Event, error) {
	var event *Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		return nil, err
	}
	return event, nil
}

func EventPipe(client interface{}, message []byte) error {
	event, err := parseEvent(message)
	if err != nil {
		return err
	}
	log.Printf("Event: %+v\n", event)
	return nil
}
