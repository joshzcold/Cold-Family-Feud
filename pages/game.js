import { useState, useEffect } from 'react';
import Title from '../components/title'
import Round from '../components/round'
import Final from '../components/final'

export default function Game(props){
  const [game, setGame] = useState({})
  let mistakes 
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
        mistakes = <h1>X</h1>
        var audio = new Audio('wrong.mp3');
        audio.play();
      } else if(json.action === "reveal"){
        var audio = new Audio('good-answer.mp3');
        audio.play();
      }else if(json.action === "final_reveal"){
        var audio = new Audio('fm-answer-reveal.mp3');
        audio.play();
      }else if(json.action === "final_submit"){
        var audio = new Audio('good-answer.mp3');
        audio.play();
      }else if(json.action === "final_wrong"){
        var audio = new Audio('try-again.mp3');
        audio.play();
      }



    };

  }, [])

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
      {mistakes}
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
