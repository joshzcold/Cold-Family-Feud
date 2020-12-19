import { useState, useEffect } from 'react';

export default function Game(props){
  const [game, setGame] = useState({})
  useEffect(() => {
    var ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function() {
      console.log("game connected to server");
    };

    ws.onmessage = function (evt) { 
      var received_msg = evt.data;
      console.log("server update in game.js");
      setGame(JSON.parse(received_msg))
    };

  }, [])

  console.log(game)

  if(game.teams != null){

  return (
    <div>
      <p>{game.teams[0].name}</p>
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
