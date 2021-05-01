const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const axios = require('axios')
const https = require('https')
const fs = require("fs")
const path = require( "path" );
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

let average = (array) => array.reduce((a, b) => a + b) / array.length;
let game = {
  registeredPlayers: {},
  buzzed:[],
  teams: [
    {
      name: "Team 1",
      points: 0,
      mistakes:0
    },
    {
      name: "Team 2",
      points: 0,
      mistakes:0
    }
  ],
  title: true,
  title_text: "Change Me",
  point_tracker: [],
  is_final_round: false,
  is_final_second: false,
  hide_first_round: true,
  round: 0,
}

// We copy the inital state of the game so we can change it
// and still use game as a template
let game_copy = JSON.parse(JSON.stringify(game)); 

const wss = new WebSocket.Server({ port: 8080 });

wss.broadcast = function(data) {
  wss.clients.forEach(client => client.send(data));
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try{
      process.stdout.write(".");
      message = JSON.parse(message)
      if(message.action === "load_game"){
        if(message.file != null && message.lang != null){
          let data = fs.readFileSync( `games/${message.lang}/${message.file}`)
          let loaded = data.toString()
          message.data = JSON.parse(loaded)
        }

        game_copy.teams[0].points = 0
        game_copy.teams[1].points = 0
        game_copy.round = 0
        game_copy.title = true
        game_copy.rounds = message.data.rounds
        game_copy.final_round = message.data.final_round
        game_copy.gameCopy = []
        game_copy.final_round_timers = message.data.final_round_timers
        game_copy.point_tracker = new Array(message.data.rounds.length).fill(0);
        game_copy.tick = new Date().getTime()
        wss.broadcast(JSON.stringify({action:"data",data:game_copy}));
      }
      else if (message.action === "data"){
        // copy off what the round used to be for comparison
        let copy_round = game_copy.round
        let copy_title = game_copy.title
        delete message.data.registeredPlayers
        let clone = Object.assign(game_copy, message.data);
        game_copy = clone
        if(copy_round != message.data.round || copy_title != message.data.title){
          game_copy.buzzed = []
          game_copy.tick = new Date().getTime()
          wss.broadcast(JSON.stringify({action: "clearbuzzers"}));
        }
        // get the current time to compare when users buzz in
        wss.broadcast(JSON.stringify({action:"data",data:game_copy}));
      }
      else if (message.action === "registerbuzz"){
        let id = uuidv4()
        try{
          while(!game_copy.registeredPlayers[id]){
            if(game_copy.registeredPlayers[id]){
              id = uuidv4() 
            }else{
              game_copy.registeredPlayers[id]={
                latencies:[],
                name: message.name,
                team: message.team
              }
              console.log("Registered player: ", id)
            }
          }
          // get inital latency, client pongs on registered
          game_copy.registeredPlayers[id].start = new Date()
          ws.send(JSON.stringify({action: "ping", id: id}))
          ws.send(JSON.stringify({action: "registered", id:id}))
          wss.broadcast(JSON.stringify({action:"data",data:game_copy}));
        }catch(e){
          console.error("Problem in register ", e)
        }
        // get recurring latency
        setInterval(() => {
          try{
            game_copy.registeredPlayers[id].start = new Date()
            ws.send(JSON.stringify({action: "ping", id: id}))
          }catch(e){
            console.log("Player disconnected? ", e)
          }
        }, 5000)
      }
      else if (message.action === "pong"){
        let player = game_copy.registeredPlayers[message.id]
        let end = new Date()
        let start = player.start
        let latency = end.getTime() - start.getTime()
        while(player.latencies.length >= 5){
          player.latencies.shift()
        }
        player.latencies.push(latency)
        player.latency = average(player.latencies)
      }
      else if (message.action === "clearbuzzers"){
        game_copy.buzzed = []
        game_copy.tick = new Date().getTime()
        wss.broadcast(JSON.stringify({action: "data", data: game_copy}));
        wss.broadcast(JSON.stringify({action: "clearbuzzers"}));
      }
      else if (message.action === "change_lang"){
        fs.readdir(`games/${message.data}/`, (err, files) => {
          if(err){console.error(err)}
          wss.broadcast(JSON.stringify({
            action: "change_lang",
            data: message.data,
            games: files
          }));
        })
      }
      else if (message.action === "buzz"){
        let time = new Date().getTime() - game_copy.registeredPlayers[message.id].latency
        if(game_copy.buzzed.length === 0){
          game_copy.buzzed.unshift({id: message.id, time: time})
        }else{
          for(const [i,b] of game_copy.buzzed.entries()){
            if(b.time < time){
              // saved buzzed was quicker than incoming buzz
              if(i === game_copy.buzzed.length -1){
                game_copy.buzzed.push({ id: message.id, time: time })
                break
              }
            }else{
              game_copy.buzzed.splice(i, 0, { id: message.id, time: time });
              break
            }
          }
        }
        ws.send(JSON.stringify({action: "buzzed"}))
        wss.broadcast(JSON.stringify({action: "data", data: game_copy}));
      }
      else{
        // even if not specified we always expect an action
        if(message.action){
          wss.broadcast(JSON.stringify(message));
        }else{
          console.log("didnt expect this message server: ", message)
        }
      }
    }catch(e){
      console.error("Error in processing socket message: ", e)
    }
  });

  console.log("incoming connection... sending data");
  wss.broadcast(JSON.stringify({action:"data", data: game_copy}));
});

app.prepare().then(async () => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
