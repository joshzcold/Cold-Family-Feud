import { useState, useEffect, useRef } from 'react';
import "tailwindcss/tailwind.css";

export default function Admin(props){
  const [game, setGame] = useState({})
  const ws = useRef(null)
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.onopen = function() {
      console.log("game connected to server");
    };

    ws.current.onmessage = function (evt) { 
      var received_msg = evt.data;
      let json = JSON.parse(received_msg)
      if(json.action == null ){
        setGame(json)
      } else if(json.action === "data"){
        setGame(json.data)
      }
    };
  }, [])

  console.debug("This is game", game)

  if(game.teams != null){
    let current_screen 
    if(game.title){
      current_screen = "title screen"
    } else if(game.is_final_round){
      current_screen = "final round"
    }else{
      current_screen = `Round ${game.round + 1}`
    }

    if(game.rounds != null){
      // var put it into function scope
      var current_round = game.rounds[game.round]
      console.debug("This is current round", current_round)
    }
    return (
      <div >

        <div class="py-8">
          <div class="flex flex-row px-10 items-center">
            <a href="/new" class="flex-grow">
              <button class="hover:shadow-md rounded-md bg-gray-100 p-2">
                Create New Game
              </button>
            </a>
            <div class="flex flex-col border-2  rounded-lg">
              <div class="p-2 ml-4 items-center transform translate-y-3">
                <input type="file" class="" id="gamePicker" accept=".json"/>
                <button class="hover:shadow-md rounded-md p-2 bg-blue-200" onClick={() => {
                  var file = document.getElementById("gamePicker").files[0];
                  if (file) {
                    var reader = new FileReader();
                    reader.readAsText(file, 'utf-8');
                    reader.onload = function (evt) {
                      let data = JSON.parse(evt.target.result)
                      console.debug(data)
                      // TODO some error checking for valid game data
                      ws.current.send(JSON.stringify({
                        action: "load_game", data: data
                      }))
                    }
                    reader.onerror = function (evt) {
                      console.error("error reading file")
                    }
                  }
                }}>Submit</button>
              </div>
              <div class="flex flex-row">
                <span class="translate-x-3 px-2 text-black text-opacity-50 flex-shrink inline translate-y-3 transform bg-white ">Load Game</span>
                <div class="flex-grow"/>
              </div>
            </div>
          </div>
        </div>
        <div class="py-8">
          <div class="flex flex-row px-10 py-5">
            <p class="flex-grow text-2xl">Title Text</p>
            <div class="text-center flex-grow">
              <p class="text-black text-opacity-50 ">If title looks wrong refresh /game window</p>
              <p class="text-black text-opacity-50 ">title text will be cut off at the edges of the browser window</p>
            </div>
            <input class="border-4 rounded" onChange={(e)=>{
              game.title_text = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }} placeholder="My Family"></input>
          </div>
          <div class="flex flex-row px-10 py-1">
            <p class="flex-grow text-2xl">Team 1 name: {game.teams[0].name}</p>
            <p class="flex-grow text-2xl">points: {game.teams[0].points} </p>
            <input class="border-4 rounded" onChange={(e)=>{
              game.teams[0].name = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }} placeholder="Team Name"></input>
          </div>
          <div class="flex flex-row px-10 py-1">
            <p class="flex-grow text-2xl">Team 2 name: {game.teams[1].name}</p>
            <p class="flex-grow text-2xl">points: {game.teams[1].points} </p>
            <input class="border-4 rounded" onChange={(e)=>{
              game.teams[1].name = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }} placeholder="Team Name"></input>
          </div>
        </div>
        <p class="text-4xl text-center pt-5"> Current Screen: {current_screen}</p>
        {game.rounds == null?
          <p class="text-2xl text-center py-20 text-black text-opacity-50">[Please load a game]</p>:
          <div>
            <div class="flex-row space-x-16 space-y-5">
              <h2 class="text-2xl p-5">Controls</h2>

              <button class="border-4 rounded-lg p-2" onClick={() => {
                game.point_tracker = 0
                game.title = false
                game.is_final_round = false
                game.is_final_second = false
                game.round = 0
                setGame(prv => ({
                  ...prv
                }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>start round 1</button>

              <button class="border-4 rounded-lg p-2" onClick={() => {
                game.title = false
                game.point_tracker = 0
                game.is_final_round = false
                game.is_final_second = false
                game.teams[0].mistakes = 0
                game.teams[1].mistakes = 0
                if(game.round < game.rounds.length -1){
                  game.round = game.round + 1
                }
                setGame(prv => ({ ...prv }))
                console.log(game.round)
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>next round</button>

              <select class="border-4 rounded-lg p-2"  value={game.round} onChange={(e) => {
                game.round = parseInt(e.target.value)
                game.is_final_round = false
                game.is_final_second = false
                game.teams[0].mistakes = 0
                game.teams[1].mistakes = 0
                game.title =false
                game.point_tracker = 0
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>
                {game.rounds.map(( key, index ) =>
                <option value={index}>Round {index +1}</option>)}
              </select>
              <button class="border-4 rounded-lg p-2" onClick={() => {
                game.title = true
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>title card</button>

              <button class="border-4 rounded-lg p-2" onClick={() => {
                game.point_tracker = 0
                game.title = false
                game.is_final_round = true
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
                ws.current.send(JSON.stringify({action: "set_timer", data: game.final_round_timers[0]}))
              }}>final round</button>

              <button class="border-4 bg-green-200 rounded-lg p-2" onClick={() =>{
                game.teams[0].points=game.point_tracker + game.teams[0].points
                game.point_tracker = 0
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>Team 1: {game.teams[0].name} gets points</button>
              <button class="border-4 bg-green-200 rounded-lg p-2" onClick={() =>{
                game.teams[1].points=game.point_tracker + game.teams[1].points
                game.point_tracker = 0
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
              }}>Team 2: {game.teams[1].name} gets points</button>
              <button class="border-4 bg-red-200 rounded-lg p-2" onClick={() =>{
                game.teams[0].mistakes++
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
                ws.current.send(JSON.stringify({action: "mistake", data: game.teams[0].mistake}))
              }}>Team 1: {game.teams[0].name} mistake</button>
              <button class="border-4 bg-red-200 rounded-lg p-2" onClick={() =>{
                game.teams[1].mistakes++
                setGame(prv => ({ ...prv }))
                ws.current.send(JSON.stringify({action: "data", data: game}))
                ws.current.send(JSON.stringify({action: "mistake", data: game.teams[1].mistake}))
              }}>Team 2: {game.teams[1].name} mistake</button>
            </div>
            <div class="flex flex-row items-center space-x-5  p-5">
              <h3 class="text-2xl ">Title Music </h3>
              <audio controls>
                <source src="title.mp3" type="audio/mpeg"/>
                Your browser does not support .mp3
              </audio>
            </div>

            {!game.is_final_round?
              <div>
                <div class="text-center">
                  <h2 class="text-2xl p-2 ">Game Board </h2>
                  <div class="text-center flex flex-row space-x-5 justify-center py-5">
                    <h3 class="text-2xl"> Question:</h3>
                    <p class="text-xl">{current_round.question}</p>
                  </div>
                  <div class="flex flex-row items-center space-x-5 justify-center pb-2">
                    <h3 class="text-xl">Multiplier {current_round.multiply}x</h3>
                    <h3 class="text-xl">Point Tracker: {game.point_tracker}</h3>
                  </div>
                </div>
                <div class=" text-white rounded border-4 grid grid-rows-4 grid-flow-col  p-3 mx-10 mb-10 mt-5 gap-3 ">
                  {current_round.answers.map(x => 
                  <div class="bg-blue-600 flex font-extrabold uppercase items-center text-center rounded border-2">
                    <button class="border-2 flex-grow rounded p-5" onClick={() => {
                      x.trig = !x.trig
                      setGame(prv => ({ ...prv }))

                      if(x.trig){
                        game.point_tracker = game.point_tracker + x.pnt * current_round.multiply
                        setGame(prv => ({ ...prv }))
                        ws.current.send(JSON.stringify({action: "reveal"}))
                      }else{
                        game.point_tracker = game.point_tracker - x.pnt * current_round.multiply
                        setGame(prv => ({ ...prv }))
                      }
                      ws.current.send(JSON.stringify({action: "data", data: game}))
                    }}>
                      {x.ans} {x.pnt}
                      {x.trig?
                        <span> - answered</span>:null
                      }
                    </button>
                  </div>
                  )}
                </div>
              </div>
              :
              <div>
                <div>
                  <div class="flex py-5 items-center flex-row space-x-5">
                    <h2 class="text-2xl px-5">Final Round </h2>
                    <button class="border-4 rounded-lg p-2" onClick={() => {
                      game.is_final_second = true
                      game.gameCopy = JSON.parse(JSON.stringify(game.final_round));
                      game.final_round.forEach(rnd => {
                        rnd.selection = 0
                        rnd.points = 0
                        rnd.input = ""
                        rnd.revealed = false
                      })
                      setGame(prv => ({ ...prv }))
                      ws.current.send(JSON.stringify({action: "data", data: game}))
                      ws.current.send(JSON.stringify({action: "set_timer", data: game.final_round_timers[1]}))
                    }}>Start Final Round 2</button>

                    <button class="border-4 rounded-lg p-2" onClick={() => {
                      if(game.is_final_second){
                        ws.current.send(JSON.stringify({action: "start_timer", data: game.final_round_timers[1]}))
                      }else{
                        ws.current.send(JSON.stringify({action: "start_timer", data: game.final_round_timers[0]}))
                      }
                    }}>Start Timer</button>

                    <button class="border-4 rounded-lg p-2" onClick={() => {
                      ws.current.send(JSON.stringify({action: "stop_timer"}))
                    }}>Stop Timer</button>

                    {game.hide_first_round?
                      <button class="border-4 rounded-lg p-2" onClick={() => {
                        game.hide_first_round = false
                        setGame(prv => ({ ...prv }))
                        ws.current.send(JSON.stringify({action: "data", data: game}))
                      }}>Reveal First Round Answers</button>
                      :
                      <button class="border-4 rounded-lg p-2" onClick={() => {
                        game.hide_first_round = true
                        setGame(prv => ({ ...prv }))
                        ws.current.send(JSON.stringify({action: "data", data: game}))
                      }}>Hide First Round Answers</button>
                    }
                  </div>

                  {game.final_round.map(x =>
                  <div class="px-5">
                    <p class="text-xl pb-1">{x.question}</p>
                    <div class="flex flex-row space-x-10 pb-7">
                      <input class="border-4 rounded" placeholder="answer" onChange={(e) => {
                        x.input = e.target.value
                        setGame(prv => ({ ...prv }))
                      }}/>
                      <select class="border-4 rounded-lg p-2" onChange={(e) => {
                        x.selection = parseInt(e.target.value)
                        setGame(prv => ({ ...prv }))
                        ws.current.send(JSON.stringify({action: "data", data: game}))
                      }}>
                        {x.answers.map((key, index) => <option value={index}>
                          {x.answers[index][0]} {x.answers[index][1]}</option>)}
                      </select>
                      <div class="flex-grow text-right pr-20">
                        <button class="border-4 rounded-lg p-2" onClick={() => {
                          x.points = 0
                          setGame(prv => ({ ...prv }))
                          ws.current.send(JSON.stringify({action: "data", data: game}))
                          ws.current.send(JSON.stringify({action: "final_wrong"}))
                        }}>wrong</button>

                        <button class="border-4 rounded-lg p-2" onClick={() => {
                          x.revealed = true
                          setGame(prv => ({ ...prv }))
                          ws.current.send(JSON.stringify({action: "data", data: game}))
                          ws.current.send(JSON.stringify({action: "final_reveal"}))
                        }}>reveal answer</button>

                        <button class="border-4 rounded-lg p-2" onClick={() => {
                          x.points = x.answers[x.selection][1]
                          setGame(prv => ({ ...prv }))
                          ws.current.send(JSON.stringify({action: "data", data: game}))
                          ws.current.send(JSON.stringify({action: "final_submit"}))
                        }}>submit</button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            }

          </div>
        }
        {/* <div> */}
        {/*   <h2>Admin Actions</h2> */}
        {/*   <button onClick={() => { */}
        {/*     setGame(JSON.parse(JSON.stringify(reset))) */}
        {/*   }}>Reset Game</button> */}
        {/* </div> */}
      </div>
    )
  } else {
    return(
      <div>
        <p>Loading ... </p>
      </div>
    )
  }

}
