package stores

type GameStore interface {
	getRoom() 
	writeRoom() error
}
