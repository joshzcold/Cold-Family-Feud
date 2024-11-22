package stores

import "github.com/joshzcold/Cold-Family-Feud/game"

type GameStore interface {
	getRoom() (*game.Game, error)
	writeRoom() error
	deleteRoom() error
	saveLogo() error
	loadLogo() ([]byte, error)
}
