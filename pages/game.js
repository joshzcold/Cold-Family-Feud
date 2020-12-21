import { useState, useEffect } from 'react';
import Title from '../components/title'
import Round from '../components/round'
import Final from '../components/final'
import "tailwindcss/tailwind.css";

let timerInterval = null

export default function Game(props){
  const [game, setGame] = useState({})
  const [timer, setTimer] = useState(0)
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
      }else if(json.action === "set_timer"){
        setTimer(json.data)
      }else if(json.action === "stop_timer"){
        clearInterval(timerInterval)
      }else if(json.action === "start_timer"){
        let limit = json.data
        timerInterval = setInterval(() => {
          if(limit > 0){
            limit = limit -1
            setTimer(limit)
          }else{
            var audio = new Audio('try-again.mp3');
            audio.play();
            clearInterval(timerInterval)
            setTimer(json.data)
          }
        }, 1000)

      }else{
        console.error("didn't expect", json)
      }

    };
  }, [])

  if(game.teams != null){
   
  let gameSession
  if(game.title){
    gameSession = <Title game={game}/>
  } else if (game.is_final_round){
    gameSession = <Final game={game} timer={timer}/>
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
