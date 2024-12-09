package main

import (
	"flag"
	"github.com/joshzcold/Cold-Family-Feud/api"
	"log"
	"net/http"
	"os"
)

var cfg = struct {
	addr  string
	store string
}{}

type flagVal struct {
	cfgVal      *string
	name        string
	defaultVal  any
	description string
	flagFunc    func(p *string, name string, value string, usage string)
	osVal       string
}

func flags() {
	flags := []flagVal{
		flagVal{
			cfgVal:     &cfg.addr,
			name:       "listen_address",
			defaultVal: ":8080",
			flagFunc:   flag.StringVar,
			osVal:      "LISTEN_ADDRESS",
			description: "Address for server to bind to.",
		},
		flagVal{
			cfgVal:     &cfg.store,
			name:       "game_store",
			defaultVal: "memory",
			flagFunc:   flag.StringVar,
			osVal:      "GAME_STORE",
			description: "Choice of storage medium of the game",
		},
	}

	for _, f := range flags {
		f.flagFunc(&f.cfgVal, f.name, f.description)
	}
	flag.Parse()
	for _, f := range flags {
		if envVar := os.Getenv(f.osVal); envVar != "" {
			f.cfgVal = &envVar
		}
	}
}

func main() {
	flags()
	err := api.NewGameStore(cfg.store)
	if err != nil {
		log.Panicf("Error: unable initalize store: %s", err)
	}

	http.HandleFunc("/api/ws", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
		api.ServeWs(httpWriter, httpRequest)
	})

	http.HandleFunc("/api/rooms/{roomCode}/logo", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
		roomCode := httpRequest.PathValue("roomCode")
		api.FetchLogo(httpWriter, roomCode)
	})
	log.Printf("Server listening on %s", cfg.addr)
	err = http.ListenAndServe(*&cfg.addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
