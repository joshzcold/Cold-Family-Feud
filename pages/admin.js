import { useState, useEffect, useRef } from 'react';

export default function Admin(props){
  const [game, setGame] = useState({})
  const [point_tracker, setPointTracker] = useState(0)
  const ws = useRef(null)
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.onopen = function() {
      console.log("game connected to server");
    };

    ws.current.onmessage = function (evt) { 
      var received_msg = evt.data;
      console.log("server update in admin.js");
      setGame(JSON.parse(received_msg))
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
              ws.current.send(JSON.stringify(game))
            }} placeholder={game.teams[0].name}></input>
          </div>
          <div>
            <p>Team 2 name: {game.teams[1].name} points: {game.teams[1].points} </p>
            <input onChange={(e)=>{
              game.teams[1].name = e.target.value
              setGame(prv => ({ ...prv }));
              ws.current.send(JSON.stringify(game))
              ;}} placeholder={game.teams[1].name}></input>
          </div>
        </div>

        {!game.is_final_round?
          <div>
            <div>
              <h2>Game Board </h2>
              <h3> Question:</h3>
              <p>{current_round.question}</p>
              <h3>Multiplier {current_round.multiply}x</h3>
              <h3>Point Tracker: {point_tracker}</h3>
            </div>
            <div>
              {current_round.answers.map(x => 
              <div>
                <button onClick={() => {
                  x.trig = !x.trig
                  if(x.trig){
                    setPointTracker(point_tracker + x.pnt * current_round.multiply)
                  }else{
                    setPointTracker(point_tracker - x.pnt * current_round.multiply)
                  }
                }}>
                  {x.ans} {x.pnt}
                  {x.trig?
                    <span> - answered</span>:null
                  }
                </button>
              </div>
              )}
            </div>
            <div>
              <h2>Controls</h2>

              <button onClick={() => {
                setPointTracker(0)
                setGame(prv => ({
                  ...prv, title: false,
                  is_final_round: false,
                  round: 0
                }))
              }}>start round 1</button>

              <button onClick={() => {
                game.title = false
                setPointTracker(0)
                if(game.round < game.rounds.length -1){
                  game.round = game.round + 1
                }
                setGame(prv => ({ ...prv }))
              }}>next round</button>

              <select  value={game.round} onChange={(e) => {
                game.round = parseInt(e.target.value)
                game.is_final_round = false
                game.title =false
                setPointTracker(0)
                setGame(prv => ({ ...prv }))
              }}>
                {game.rounds.map(( key, index ) =>
                <option value={index}>Round {index +1}</option>)}
              </select>
              <button onClick={() => {
                game.title = true
                setGame(prv => ({ ...prv }))
              }}>title card</button>

              <button onClick={() => {
                setPointTracker(0)
                game.title = false
                game.is_final_round = true
                setGame(prv => ({ ...prv }))
              }}>final round</button>

              <div>
                <button onClick={() =>{
                  game.teams[0].points=point_tracker
                  setPointTracker(0)
                  setGame(prv => ({ ...prv }))
                }}>Team 1: {game.teams[0].name} gets points</button>
                <button onClick={() =>{
                  game.teams[1].points=point_tracker
                  setPointTracker(0)
                  setGame(prv => ({ ...prv }))
                }}>Team 2: {game.teams[1].name} gets points</button>
              </div>
            </div>
          <div>
            <button onClick={() =>{
              game.teams[0].mistake++
              setGame(prv => ({ ...prv }))
            }}>Team 1: {game.teams[0].name} mistake</button>
            <button onClick={() =>{
              game.teams[1].mistake++
              setGame(prv => ({ ...prv }))
            }}>Team 2: {game.teams[1].name} mistake</button>
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
                }}>
                  {x.answers.map((key, index) => <option value={index}>
                    {x.answers[index][0]} {x.answers[index][1]}</option>)}
                </select>
                <button onClick={() => {
                  x.wrong = !x.wrong
                  setGame(prv => ({ ...prv }))
                }}>wrong</button>

                <button onClick={() => {
                  x.submitted =  !x.submitted
                  setGame(prv => ({ ...prv }))
                }}>submit</button>
              </div>
              )}
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
