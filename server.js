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
  title_text: "[placeholder]",
  point_tracker: 0,
  is_final_round: false,
  is_final_second: false,
  hide_first_round: true,
  round: 0,
}

const wss = new WebSocket.Server({ port: 8080 });

wss.broadcast = function(data) {
  wss.clients.forEach(client => client.send(data));
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    process.stdout.write(".");
    message = JSON.parse(message)
    if(message.action === "load_game"){
      game.rounds = message.data.rounds
      game.final_round = message.data.final_round
      game.final_round_timers = message.data.final_round_timers
      wss.broadcast(JSON.stringify(game));
    }else if(message.action === "data"){
      game = message
      wss.broadcast(JSON.stringify(game));
    }
  });

  console.log("incoming connection... sending data");
  wss.broadcast(JSON.stringify(game));
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
