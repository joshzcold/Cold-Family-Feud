package main

import (
	"flag"
	"github.com/joshzcold/Cold-Family-Feud/api"
	"log"
	"net/http"
)

var cfg = struct {
	addr  string
	store string
}{}

func main() {

	flag.StringVar(&cfg.addr, "listen_address", ":8080", "Address for server to bind to.")
	flag.StringVar(&cfg.store, "game_store", "memory", "Choice of storage medium of the game")
	flag.Parse()

	err := api.NewGameStore(cfg.store)
	if err != nil {
		log.Panicf("Error: unable initalize store: %w", err)
	}

	http.HandleFunc("/ws", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
		api.ServeWs(httpWriter, httpRequest)
	})
	log.Printf("Server listening on %s", cfg.addr)
	err = http.ListenAndServe(*&cfg.addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
