import { useState, useEffect, useRef } from 'react';

function registerBuzzer(team, ws){
  ws.current.send(JSON.stringify({action: "registerbuzz", team: team}))
}

export default function Buzzer(props){
  const ws = useRef(null)
  const [buzzerReg, setBuzzerReg] = useState()
  const [game, setGame] = useState({})
  useEffect(() => {
    ws.current = new WebSocket(`ws://${ window.location.hostname }:8080`); 
    ws.current.onopen = function() {
      console.log("buzzer connected to server");
    };

    ws.current.onmessage = function (evt) { 
      let received_msg = evt.data;
      let json = JSON.parse(received_msg)
      console.log(json)
      if(json.action === "ping"){
        // server gets the average latency periodically
        ws.current.send(JSON.stringify({action: "pong", id: `${ json.id }`}))
      }else if(json.action === "data"){
        setGame(json.data)
      }else if(json.action === "registered"){
        setBuzzerReg(json.id)
        ws.current.send(JSON.stringify({action: "pong", id: `${ json.id }`}))
      }    
    };
  }, [])


  return(
    <div>
      {buzzerReg != null? 
        <div>
        <div><h1>REGISTERED</h1></div>
          <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
            BUZZ
          </button>
        </div>
        :
        <div>
          {game.teams?
            <div>
              <h1>Pick your team</h1>
              <button class="hover:shadow-md rounded-md bg-blue-200 p-2" 
                onClick={()=>{registerBuzzer(0, ws)}}>
                {game.teams[0].name}
              </button>
              <button class="hover:shadow-md rounded-md bg-blue-200 p-2"
                onClick={()=>{registerBuzzer(1, ws)}}>
                {game.teams[1].name}
              </button>
            </div>
            :<p>Loading...</p>
          }
        </div>
      }
    </div>
  )
}


