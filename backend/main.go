package main

import (
	"flag"
	"log"
	"net/http"
	"github.com/joshzcold/Cold-Family-Feud/ws"
)

var cfg = struct {
	addr string
}{}

func main() {

	flag.StringVar(&cfg.addr, "listen-address", ":8080", "Address for server to bind to.")
	flag.Parse()
	// hub := ws.NewHub()
	// go hub.Run()
	http.HandleFunc("/ws", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
		ws.ServeWs(httpWriter, httpRequest)
	})
	log.Printf("Server listening on %s", cfg.addr)
	err := http.ListenAndServe(*&cfg.addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
