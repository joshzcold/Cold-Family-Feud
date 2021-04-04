const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const axios = require('axios')
const https = require('https')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const WebSocket = require('ws');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

let game = {
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
        game_copy.teams[0].points = 0
        game_copy.teams[1].points = 0
        game_copy.round = 0
        game_copy.title = true
        game_copy.rounds = message.data.rounds
        game_copy.final_round = message.data.final_round
        game_copy.gameCopy = []
        game_copy.final_round_timers = message.data.final_round_timers
        game_copy.point_tracker = new Array(message.data.rounds.length).fill(0);
        wss.broadcast(JSON.stringify(game_copy));
      }else if (message.action === "data"){
        game_copy = message.data
        wss.broadcast(JSON.stringify(game_copy));
      }
      else{
        wss.broadcast(JSON.stringify(message));
      }
    }catch(e){
      console.error("Error in processing socket message: ", e)
    }
  });

  console.log("incoming connection... sending data");
  wss.broadcast(JSON.stringify(game_copy));
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
