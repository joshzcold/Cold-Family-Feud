package main

import (
	"flag"
	"github.com/joshzcold/Cold-Family-Feud/api"
	"log"
	"net/http"
)

var cfg = struct {
	addr string
}{}

func main() {

	flag.StringVar(&cfg.addr, "listen-address", ":8080", "Address for server to bind to.")
	flag.Parse()

	// TODO Initialize store based on argument

	http.HandleFunc("/ws", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
		api.ServeWs(httpWriter, httpRequest)
	})
	log.Printf("Server listening on %s", cfg.addr)
	err := http.ListenAndServe(*&cfg.addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
