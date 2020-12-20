import { useState, useEffect } from 'react';
import Title from '../components/title'
import Round from '../components/round'
import Final from '../components/final'

export default function Game(props){
  const [game, setGame] = useState({})
  useEffect(() => {
    var ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function() {
      console.log("game connected to server");
    };

    ws.onmessage = function (evt) { 
      var received_msg = evt.data;
      let json = JSON.parse(received_msg)
      if(json.action == null ){
        setGame(json)
      } else if(json.action === "data"){
        setGame(json.data)
      } else if(json.action === "mistake"){
        console.log("BRRRRRRR", json.data)
      }
    };

  }, [])

  console.log(game)

  if(game.teams != null){
   
  let gameSession
  if(game.title){
    gameSession = <Title/>
  } else if (game.is_final_round){
    gameSession = <Final game={game}/>
  }else{
    gameSession = <Round game={game}/>
  }

  return (
    <div>
      {gameSession}
    </div>
  )
  }else{
    return(
      <div>
        <p>loading ...</p>
      </div>
    )
  }
}
