const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const glob = require("glob");

const ioHandler = (req, res) => {
  if (!res.socket.server.ws) {
    console.log("*First use, starting websockets");

    const wss = new WebSocket.Server({ server: res.socket.server });

    function makeRoom(length = 4) {
      var result = [];
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength))
        );
      }
      return result.join("");
    }

    function pingInterval(room, id, ws) {
      // get recurring latency
      console.debug("Setting ping interval for player: ", id);
      let interval = setInterval(() => {
        try {
          if (
            ws.readyState === WebSocket.CLOSED ||
            ws.readyState === WebSocket.CLOSING
          ) {
            console.debug("Player disconnected, closing ping", id);
            clearInterval(interval);
          } else {
            console.debug("Sending ping to id", id);
            room.game.registeredPlayers[id].start = new Date();
            ws.send(JSON.stringify({ action: "ping", id: id }));
          }
        } catch (e) {
          console.error("Player disconnected? ", e);
          clearInterval(interval);
        }
      }, 5000);

      room.intervals[id] = interval;
      console.debug(
        "room.intervals length => ",
        Object.keys(room.intervals).length
      );
    }

    // loop until we register the host with an id
    function registerPlayer(roomCode, host = false, message = {}, ws) {
      let id = uuidv4();
      let game = rooms[roomCode].game;
      while (!game.registeredPlayers[id]) {
        if (game.registeredPlayers[id]) {
          id = uuidv4();
        } else {
          if (host) {
            game.registeredPlayers[id] = "host";
            rooms[roomCode].connections[id] = ws;
            console.debug("Registered player as host: ", id, roomCode);
          } else {
            game.registeredPlayers[id] = {
              role: "player",
              name: message.name,
            };
            rooms[roomCode].connections[id] = ws;
            console.debug("Registered player: ", id, message.name, roomCode);
          }
        }
      }
      return id;
    }

    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    let rooms = {};
    let game = {
      registeredPlayers: {},
      buzzed: [],
      teams: [
        {
          name: "Team 1",
          points: 0,
          mistakes: 0,
        },
        {
          name: "Team 2",
          points: 0,
          mistakes: 0,
        },
      ],
      title: true,
      title_text: "",
      point_tracker: [],
      is_final_round: false,
      is_final_second: false,
      hide_first_round: false,
      round: 0,
    };

    wss.broadcast = function(room, data) {
      if (rooms[room]) {
        Object.keys(rooms[room].connections).forEach((rp) => {
          rooms[room].connections[rp].send(data);
        });
      } else {
        console.error("room code not found in rooms", room);
      }
    };

    const moreThanOneHourAgo = (date) => {
      const HOUR = 1000 * 60 * 60;
      const anHourAgo = Date.now() - HOUR;

      return date < anHourAgo;
    };

    setInterval(() => {
      for (const [room, roomData] of Object.entries(rooms)) {
        if (roomData.game?.tick) {
          if (roomData.game.tick) {
            if (moreThanOneHourAgo(new Date(roomData.game.tick))) {
              console.debug("clearing room, no activity for 1 hour: ", room);
              wss.broadcast(room, JSON.stringify({ action: "data", data: {} }));
              wss.broadcast(
                room,
                JSON.stringify({
                  action: "error",
                  message: "game closed, no activity for 1 hour",
                })
              );
              delete rooms[room];
            }
          }
        }
      }
    }, 10000);

    wss.on("connection", function connection(ws, req) {
      ws.on("error", (error) => {
        //handle error
        console.error("WebSocket error: ", error);
        ws.close();
      });

      ws.on("message", function incoming(message) {
        try {
          message = JSON.parse(message);
          if (message.action === "load_game") {
            if (message.file != null && message.lang != null) {
              console.debug(
                "attempting to read file from selector",
                message.file,
                message.lang
              );
              let data = fs.readFileSync(
                `games/${message.lang}/${message.file}`
              );
              let loaded = data.toString();
              message.data = JSON.parse(loaded);
            }

            let game = rooms[message.room].game;
            game.teams[0].points = 0;
            game.teams[1].points = 0;
            game.round = 0;
            game.title = true;
            game.rounds = message.data.rounds;
            // clone the final round so we can store data about the second final round
            game.final_round = message.data.final_round;
            game.final_round_2 = message.data.final_round;
            game.gameCopy = [];
            game.final_round_timers = message.data.final_round_timers;
            game.point_tracker = new Array(message.data.rounds.length).fill(0);
            game.tick = new Date().getTime();
            wss.broadcast(
              message.room,
              JSON.stringify({ action: "data", data: game })
            );
          } else if (message.action === "host_room") {
            // loop until we find an available room code
            let roomCode = makeRoom();
            while (rooms[roomCode]) {
              roomCode = makeRoom();
            }

            rooms[roomCode] = {};

            rooms[roomCode].intervals = {};
            rooms[roomCode].game = JSON.parse(JSON.stringify(game));
            rooms[roomCode].game.tick = new Date().getTime();
            rooms[roomCode].game.room = roomCode;
            rooms[roomCode].connections = {};

            let id = registerPlayer(roomCode, true, {}, ws);

            // send back details to client
            ws.send(
              JSON.stringify({
                action: "host_room",
                room: roomCode,
                game: rooms[roomCode].game,
                id: id,
              })
            );
          } else if (message.action === "game_window") {
            let [room_code, user_id] = message.session.split(":");
            rooms[room_code].connections[`game_window_${uuidv4()}`] = ws;
            wss.broadcast(
              room_code,
              JSON.stringify({ action: "data", data: rooms[room_code].game })
            );
          } else if (message.action === "join_room") {
            let roomCode = message.room.toUpperCase();
            console.debug("joining room", roomCode);
            if (rooms[roomCode]) {
              let id = registerPlayer(roomCode, false, message, ws);
              rooms[roomCode].game.tick = new Date().getTime();
              ws.send(
                JSON.stringify({
                  action: "join_room",
                  room: roomCode,
                  game: rooms[roomCode].game,
                  id: id,
                })
              );
            } else {
              // TODO errors sent from server should be internationalized
              ws.send(
                JSON.stringify({ action: "error", message: "room not found" })
              );
            }
          } else if (message.action === "quit") {
            console.debug(
              "user quit game",
              message.room,
              message.id,
              message.host
            );
            if (message.host) {
              wss.broadcast(message.room, JSON.stringify({ action: "quit" }));
              wss.broadcast(
                message.room,
                JSON.stringify({
                  action: "error",
                  message: "host quit the game",
                })
              );

              // if host quits then we need to clean up the running intervals
              if (rooms[message.room].intervals) {
                let players = rooms[message.room].intervals;
                for (const [id, entry] of Object.entries(players)) {
                  console.debug("Clear interval =>", entry);
                  clearInterval(entry);
                }
              }
              // clear ws from server
              if (rooms[message.room].connections) {
                for (const [id, ws_entry] of Object.entries(
                  rooms[message.room].connections
                )) {
                  ws_entry.close();
                }
              }
              delete rooms[message.room];
            } else {
              let interval = rooms[message.room].intervals[message.id];
              console.debug("Clear interval =>", interval);
              if (interval) {
                clearInterval(interval);
              }
              let ws = rooms[message.room].connections[message.id];
              ws.send(JSON.stringify({ action: "quit" }));
              rooms[message.room].game.buzzed.forEach((b, index) => {
                if (b.id === message.id) {
                  rooms[message.room].game.buzzed.splice(index, 1);
                }
              });
              ws.close();
              delete rooms[message.room].game.registeredPlayers[message.id];
              delete rooms[message.room].connections[message.id];
              wss.broadcast(
                message.room,
                JSON.stringify({
                  action: "data",
                  data: rooms[message.room].game,
                })
              );
            }
          } else if (message.action === "get_back_in") {
            let [room_code, user_id, team] = message.session.split(":");
            if (rooms[room_code]) {
              if (rooms[room_code].game.registeredPlayers[user_id]) {
                console.debug(
                  "user session get_back_in:",
                  room_code,
                  user_id,
                  team
                );
                // set the new websocket connection
                rooms[room_code].connections[user_id] = ws;
                ws.send(
                  JSON.stringify({
                    action: "get_back_in",
                    room: room_code,
                    game: rooms[room_code].game,
                    id: user_id,
                    player: rooms[room_code].game.registeredPlayers[user_id],
                    team: parseInt(team),
                  })
                );

                if (Number.isInteger(parseInt(team))) {
                  pingInterval(rooms[room_code], user_id, ws);
                }
              }
            }
          } else if (message.action === "data") {
            // copy off what the round used to be for comparison
            let game = rooms[message.room].game;
            let copy_round = game.round;
            let copy_title = game.title;
            delete message.data.registeredPlayers;
            let clone = Object.assign(game, message.data);
            game = clone;
            if (
              copy_round != message.data.round ||
              copy_title != message.data.title
            ) {
              game.buzzed = [];
              game.tick = new Date().getTime();
              wss.broadcast(
                message.room,
                JSON.stringify({ action: "clearbuzzers" })
              );
            }
            // get the current time to compare when users buzz in
            wss.broadcast(
              message.room,
              JSON.stringify({ action: "data", data: game })
            );
          } else if (message.action === "registerbuzz") {
            let id = message.id;
            let game = rooms[message.room].game;
            try {
              game.registeredPlayers[id].latencies = [];
              game.registeredPlayers[id].team = message.team;
              console.debug("buzzer ready: ", id);
              // get inital latency, client pongs on registered
              game.registeredPlayers[id].start = new Date();
              ws.send(JSON.stringify({ action: "ping", id: id }));
              ws.send(JSON.stringify({ action: "registered", id: id }));
              wss.broadcast(
                message.room,
                JSON.stringify({ action: "data", data: game })
              );
            } catch (e) {
              console.error("Problem in register ", e);
            }
            pingInterval(rooms[message.room], id, ws);
          } else if (message.action === "pong") {
            console.debug("pong =>", message.room, message.id);
            let game = rooms[message.room].game;
            let player = game.registeredPlayers[message.id];
            if (player != null && player.start) {
              let end = new Date();
              let start = player.start;
              let latency = end.getTime() - start.getTime();
              while (player.latencies.length >= 5) {
                player.latencies.shift();
              }
              player.latencies.push(latency);
              player.latency = average(player.latencies);
            }
          } else if (message.action === "clearbuzzers") {
            let game = rooms[message.room].game;
            game.buzzed = [];
            game.tick = new Date().getTime();
            wss.broadcast(
              message.room,
              JSON.stringify({ action: "data", data: game })
            );
            wss.broadcast(
              message.room,
              JSON.stringify({ action: "clearbuzzers" })
            );
          } else if (message.action === "change_lang") {
            glob(
              `**/*.json`,
              { cwd: `games/${message.data}/` },
              function(err, files) {
                // files is an array of filenames.
                // If the `nonull` option is set, and nothing
                // was found, then files is ["**/*.js"]
                // er is an error object or null.
                if (err) {
                  console.error("change_lang error:", err);
                }

                var collator = new Intl.Collator(undefined, {
                  numeric: true,
                  sensitivity: "base",
                });
                wss.broadcast(
                  message.room,
                  JSON.stringify({
                    action: "change_lang",
                    data: message.data,
                    games: files.sort(collator.compare),
                  })
                );
              }
            );
          } else if (message.action === "buzz") {
            let game = rooms[message.room].game;
            let time =
              new Date().getTime() - game.registeredPlayers[message.id].latency;
            if (game.buzzed.length === 0) {
              game.buzzed.unshift({ id: message.id, time: time });
            } else {
              for (const [i, b] of game.buzzed.entries()) {
                if (b.time < time) {
                  // saved buzzed was quicker than incoming buzz
                  if (i === game.buzzed.length - 1) {
                    game.buzzed.push({ id: message.id, time: time });
                    break;
                  }
                } else {
                  game.buzzed.splice(i, 0, { id: message.id, time: time });
                  break;
                }
              }
            }
            ws.send(JSON.stringify({ action: "buzzed" }));
            wss.broadcast(
              message.room,
              JSON.stringify({ action: "data", data: game })
            );
          } else {
            // even if not specified we always expect an action
            if (message.action) {
              wss.broadcast(message.room, JSON.stringify(message));
            } else {
              console.log("didnt expect this message server: ", message);
            }
          }
        } catch (e) {
          console.error("Error in processing socket message: ", e);
        }
      });
    });

    res.socket.server.ws = wss;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
