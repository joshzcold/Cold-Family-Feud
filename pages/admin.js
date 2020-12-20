import { useState, useEffect, useRef } from 'react';

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

  console.log(game)

  if(game.teams != null){
    let current_screen 
    if(game.title){
      current_screen = "title screen"
    } else if(game.is_final_round){
      current_screen = "final round"
    }else{
      current_screen = `Round ${game.round + 1}`
    }

    let current_round = game.rounds[game.round]
    console.log(current_round)
    return (
      <div >
        <h2> Current Screen: {current_screen}</h2>

        <div>
          <h2>Teams</h2>
          <div>
            <p>Team 1 name: {game.teams[0].name} points: {game.teams[0].points} </p>
            <input onChange={(e)=>{
              game.teams[0].name = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }} placeholder={game.teams[0].name}></input>
          </div>
          <div>
            <p>Team 2 name: {game.teams[1].name} points: {game.teams[1].points} </p>
            <input onChange={(e)=>{
              game.teams[1].name = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify({action: "data", data: game}))
              ;}} placeholder={game.teams[1].name}></input>
          </div>
        </div>
        <div>
          <h2>Controls</h2>

          <button onClick={() => {
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

          <button onClick={() => {
            game.title = false
            game.point_tracker = 0
            if(game.round < game.rounds.length -1){
              game.round = game.round + 1
            }
            setGame(prv => ({ ...prv }))
            console.log(game.round)
            ws.current.send(JSON.stringify({action: "data", data: game}))
          }}>next round</button>

          <select  value={game.round} onChange={(e) => {
            game.round = parseInt(e.target.value)
            game.is_final_round = false
            game.is_final_second = false
            game.title =false
            game.point_tracker = 0
            setGame(prv => ({ ...prv }))
            ws.current.send(JSON.stringify({action: "data", data: game}))
          }}>
            {game.rounds.map(( key, index ) =>
            <option value={index}>Round {index +1}</option>)}
          </select>
          <button onClick={() => {
            game.title = true
            setGame(prv => ({ ...prv }))
            ws.current.send(JSON.stringify({action: "data", data: game}))
          }}>title card</button>

          <button onClick={() => {
            game.point_tracker = 0
            game.title = false
            game.is_final_round = true
            setGame(prv => ({ ...prv }))
            ws.current.send(JSON.stringify({action: "data", data: game}))
          }}>final round</button>

          <div>
            <button onClick={() =>{
              game.teams[0].points=game.point_tracker
              game.point_tracker = 0
              setGame(prv => ({ ...prv }))
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }}>Team 1: {game.teams[0].name} gets points</button>
            <button onClick={() =>{
              game.teams[1].points=game.point_tracker
              game.point_tracker = 0
              setGame(prv => ({ ...prv }))
              ws.current.send(JSON.stringify({action: "data", data: game}))
            }}>Team 2: {game.teams[1].name} gets points</button>
          </div>
        </div>
        <div>
          <button onClick={() =>{
            game.teams[0].mistakes++
            setGame(prv => ({ ...prv }))
            ws.current.send(JSON.stringify({action: "data", data: game}))
            ws.current.send(JSON.stringify({action: "mistake", data: game.teams[0].mistake}))
          }}>Team 1: {game.teams[0].name} mistake</button>
          <button onClick={() =>{
            game.teams[1].mistakes++
            setGame(prv => ({ ...prv }))
            ws.current.send(JSON.stringify({action: "data", data: game}))
            ws.current.send(JSON.stringify({action: "mistake", data: game.teams[1].mistake}))
          }}>Team 2: {game.teams[1].name} mistake</button>
        </div>
        <div>
          <h3>Title Music </h3>
          <audio controls>
            <source src="title.mp3" type="audio/mpeg"/>
            Your browser does not support .mp3
          </audio>
        </div>

        {!game.is_final_round?
          <div>
            <div>
              <h2>Game Board </h2>
              <h3> Question:</h3>
              <p>{current_round.question}</p>
              <h3>Multiplier {current_round.multiply}x</h3>
              <h3>Point Tracker: {game.point_tracker}</h3>
            </div>
            <div>
              {current_round.answers.map(x => 
              <div>
                <button onClick={() => {
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
              <h2>Final Round </h2>
              {game.final_round.map(x =>
              <div>
                <p>{x.question}</p>
                <input placeholder="answer" onChange={(e) => {
                  x.input = e.target.value
                  setGame(prv => ({ ...prv }))
                }}/>
                <select onChange={(e) => {
                  x.selection = parseInt(e.target.value)
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                }}>
                  {x.answers.map((key, index) => <option value={index}>
                    {x.answers[index][0]} {x.answers[index][1]}</option>)}
                </select>
                <button onClick={() => {
                  x.points = 0
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                  ws.current.send(JSON.stringify({action: "final_wrong"}))
                }}>wrong</button>

                <button onClick={() => {
                  x.revealed = true
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                  ws.current.send(JSON.stringify({action: "final_reveal"}))
                }}>reveal answer</button>


                <button onClick={() => {
                  x.points = x.answers[x.selection][1]
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                  ws.current.send(JSON.stringify({action: "final_submit"}))
                }}>submit</button>
              </div>
              )}
              <button onClick={() => {
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
              }}>Start Final Round 2</button>

              {game.hide_first_round?
                <button onClick={() => {
                  game.hide_first_round = false
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                }}>Reveal First Round Answers</button>
                :
                <button onClick={() => {
                  game.hide_first_round = true
                  setGame(prv => ({ ...prv }))
                  ws.current.send(JSON.stringify({action: "data", data: game}))
                }}>Hide First Round Answers</button>
              }
            </div>
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
