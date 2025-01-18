# Doing Development on Friendly Feud

## Dependencies

Windows:

It is required to run this project under [WSL-2](https://learn.microsoft.com/en-us/windows/wsl/install)

Required Applications:

- `make`

- `docker`

- `docker-compose`

- `nodejs + npm` (Check `./Dockerfile`) for current supported version.

- `golang`

- `chromium` (for e2e tests)


| Application                                                              | OS      | Install Method                                                                               |
| ---                                                                      | ---     | ---                                                                                          |
| [make](https://www.gnu.org/software/make/)                               | -       | -                                                                                            |
| -                                                                        | Linux   | Install via package manager                                                                  |
| -                                                                        | Macos   | Install via [homebrew](https://formulae.brew.sh/formula/make)                                |
| -                                                                        | Windows | Install via package manager in WSL                                                           |
| [docker](https://docs.docker.com/engine/install/)                        | -       | -                                                                                            |
| -                                                                        | Linux   | Install via package manager                                                                  |
| -                                                                        | Macos   | Install via [docker desktop](https://docs.docker.com/desktop/setup/install/mac-install/)     |
| -                                                                        | Windows | Install via [docker desktop](https://docs.docker.com/desktop/features/wsl/)                  |
| [docker-compose](https://docs.docker.com/compose/install/)               | -       | -                                                                                            |
| -                                                                        | Linux   | Install via package manager                                                                  |
| -                                                                        | Macos   | Install via [docker desktop](https://docs.docker.com/desktop/setup/install/mac-install/)     |
| -                                                                        | Windows | Install via [docker desktop](https://docs.docker.com/desktop/features/wsl/)                  |
| [nodejs + npm](https://nodejs.org/en/download)                           | -       | Follow instructions per each OS https://nodejs.org/en/download                               |
| [golang](https://go.dev/doc/install)                                     | -       | Follow instructions per each OS https://go.dev/doc/install                                   |
| [chromium](https://www.chromium.org/getting-involved/download-chromium/) | -       | Follow instructions per each OS https://www.chromium.org/getting-involved/download-chromium/ |


## Running development

Within the `Makefile` are several targets that you can run.

These are ran like `make <target>`

In order to launch the dev stack you need to run `make dev` which will first build the required docker containers before launching the stack in `docker compose`

This is setup to "Volume Mount" your code and will auto re-build when you save changes to your source.

On inital build the golang application may be slow to build, but we save the cache of that build back out, so subsequent builds will be faster.

You can view logs of indivial containers by doing

```sh
# docker logs famf-[insert component here]-1 -f
docker container ls
docker logs famf-backend-1 -f
```

The "dev stack" is comprised of:

- frontend -> the nextjs/nodejs application
- backend  -> the golang application
- proxy    -> nginx as the entry point

Check out the [linux version](../docker/docker-compose.yaml) if on linux or macos

Check out the [windows version](../docker/docker-compose-dev-wsl.yaml) if on windows

## Running e2e tests

`make e2e-ui` will launch [playwright](https://playwright.dev/)

The e2e tests are located in the [e2e](../e2e/) folder.

Tests are marked with their `*.spec.js` file name

## How the frontend works

The frontend is using `nextjs` as its way to serve pages.

https://nextjs.org/docs/app/getting-started/project-structure

Code is arranged in the [./src](../src/) folder with [./src/pages/index.jsx](../src/pages/index.jsx) being the entry point

From their you can expect the usual "ReactJS" functionality.

The main libraries used are

- reactjs
- nextjs
- tailwindcss


The frontend connects back to the backend via the nginx proxy to setup a websocket connection that will control its behavior when data comes in.

We store a cookie to keep the user's session in the game as they refresh the page.

### Working with styles

You can use anything from [tailwindcss](https://tailwindcss.com/) as long as the colors you use match the colors found in  [tailwind.config.js](../tailwind.config.js)

```javascript
// ....
success: {
    900: "#14532D",
    700: "#15803D",
    500: "#22C55E",
    300: "#86EFAC",
    200: "#BBF7D0",
},
secondary: {
    900: "#A1A1AA",
    700: "#D4D4D8",
    500: "#E4E4E7",
    300: "#F4F4F5",
    200: "#FAFAFA",
},
// ....
```

This looks like

```html
<div className="rounded bg-success-200 p-2">{t("Answer")} 1</div>
<div className="rounded bg-primary-200 p-2">{t("points")} 1</div>
```

What this does is setup a "Theme" we use for the theme picker for the game, so make sure you use the colors named in that configuration file.

## How the backend works

The backend is a golang application in [./backend](../backend/)

The entry point of the application is `main.go` where we start our main websocket server

```go
http.HandleFunc("/api/ws", func(httpWriter http.ResponseWriter, httpRequest *http.Request) {
    api.ServeWs(httpWriter, httpRequest)
})
```

We also set a up "store" that backend functions will interact with later to store game data.

```go
err := api.NewGameStore(cfg.store)

func NewGameStore(gameStore string) error {
	switch gameStore {
	case "memory":
		log.Println("Starting famf with memory store")
		store = NewMemoryStore()
		return nil
	case "sqlite":
		log.Println("Starting famf with sqlite store")
		store, _ = NewSQLiteStore()
	default:
		return fmt.Errorf("unknown store: %q", gameStore)
	}
	return nil
}
```

The variable `store` is a variable that functions will expect to use to read and write data to "state"

```go
var store gameStore
```


This in turn sets up a connect to the frontend and creates 2 [goroutines](https://go.dev/tour/concurrency/1)  that asyncronously read and write back to the client.

```go
go client.writePump()
go client.readPump()
```

If you look in `readPump()` you will see we get the message and pass it off to `EventPipe()`

`EventPipe()` is located in [backend/api/pipe.go](../backend/api/pipe.go) and is the next "Entry Point" of the application.

This is where we take the "events" coming from the backend and run our backend functions.

We parse messages like these in the `parseEvent()` function:

```json
{ "action": "buzz", "room": "HL6T", "id": "fds-fds-21-fds-f-321"}
{ "action": "clearbuzzers", "room": "HL6T"}
```

```go
func parseEvent(message []byte) (*Event, error) {
	var event *Event
	err := json.Unmarshal(message, &event)
	if err != nil {
		return nil, err
	}
	return event, nil
}
```

Then if the action is something found in the `recieveActions` map then we will call
that function that matches the action key.

From there the backend functions will a similar pattern:

1. get data the store matching the room.
2. do some actions on the new data.
3. send back data either to the player or the whole room.
4. write back changes to the data back to the store.

If you see something like this

```go
client.send <- message
```

or 

```go
if room.Hub.broadcast != nil {
    room.Hub.broadcast <- message
}
if room.Hub.stop != nil {
    room.Hub.stop <- true
}
```

We are sending data back to goroutines set when either we initalized the player connection 
or we created a [Hub](../backend/api/hub.go) when we started the room which holds all of the player connections.


### Writing a new "Store"

Writing a new game store can be pretty straight forward.

There is a go interface located in [backend/api/store.go](../backend/api/store.go) that defines the functions a new game store must have.

```go
type gameStore interface {}
```

You can see simple examples in the memory store located in [backend/api/store-memory.go](../backend/api/store-memory.go)

Which is just a big `map` that holds all of the games.

> Production deployments currently use the `sqlite` store.

If you see

```go
m.mu.RLock()
defer m.mu.RUnlock()
```

That is because clients are accessing these functions in asynchronous goroutines and this lock prevents race conditions while accessing memory.
