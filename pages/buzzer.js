import { useState, useEffect, useRef } from 'react';
import TitleLogo from "../components/title-logo"
import "tailwindcss/tailwind.css";

export default function Buzzer(props){
  const ws = useRef(null)
  const [buzzerReg, setBuzzerReg] = useState()
  const [buzzed, setBuzzed] = useState(false)
  const [pickedTeam, setPickedTeam] = useState()
  const [game, setGame] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    // TODO if there is a stored cookie of id, try to use it 
    // if the server sends back game data, then get back into the game
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
      }else if(json.action === "buzzed"){
        setBuzzed(true)
      }else if(json.action === "registered"){
        setBuzzerReg(json.id)
        ws.current.send(JSON.stringify({action: "pong", id: `${ json.id }`}))
      }else{
        console.error("didnt expect action in buzzer: ",json)
      } 
    };

  }, [])


  if(game != null){
  return(
    <div>
      <div style={{ width: "100%" }}>
        <TitleLogo insert={game.title_text}/>
      </div>
      <div class="flex flex-col p-5 justify-center text-center space-y-5">
        {buzzerReg != null? 
          <div>
            {!game.title && !game.is_final_round?
              <div class="flex flex-col justify-center">
                <div class="border-4 rounded p-5 space-y-2 text-center">
                  <h1 class="text-2xl">Buzzer Order</h1>
                  <hr/>
                  <div>
                    {game.buzzed.map((x,i) => 
                    <div class="flex flex-row space-x-2  text-sm">
                      <div class="flex-grow">
                        <p class="truncate">
                          {i+1}. {game.registeredPlayers[x.id].name}
                        </p>
                      </div>
                      <div class="flex-grow">
                        <p class="truncate w-20">
                          {game.teams[game.registeredPlayers[x.id].team].name}
                        </p>
                      </div>
                      <div class="flex-grow">
                        <p class="">
                          {(((x.time - game.tick)/1000) % 60).toFixed(2)} sec
                        </p>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
                {buzzed?
                  <p>BUZZED</p>
                  :
                  <button class="hover:shadow-md rounded-md bg-blue-200 p-2" 
                    onClick={()=>{
                      ws.current.send(JSON.stringify({action: "buzz", id: `${buzzerReg}`}))
                    }}>
                    BUZZ
                  </button>
                }
              </div>
              :
              <h1>
                Getting ready to play
              </h1>
            }
          </div>
          :
          <div>
              <div>
                {pickedTeam != null?
                  <h1>Team: {game.teams[pickedTeam].name}</h1>
                  :null
                }
                <h1>Enter your name:</h1>
                <input id="nameInput" type="text"/>
                <h1>Pick your team:</h1>
                <p>Team 1:</p>
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2"
                  onClick={()=>{setPickedTeam(0)}}>
                  {game.teams[0].name}
                </button>
                <p>Team 2:</p>
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2"
                  onClick={()=>{setPickedTeam(1)}}>
                  {game.teams[1].name}
                </button>
                <p></p>
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2"
                  onClick={()=>{
                    var name = document.getElementById("nameInput").value
                    if(name != null && pickedTeam != null && name !== ""){
                      ws.current.send(JSON.stringify({
                        action: "registerbuzz", team: pickedTeam,
                        name: name
                      }))
                    }else{
                      let errors = []
                      name == null? errors.push("Input your name"): null
                      pickedTeam == null? errors.push("Pick your team"): null
                      setError(errors.join())
                    }
                  }}>
                  register
                </button>
                {error != null && error !== ""?
                  <p>{error}</p>:null
                }
              </div>
          </div>
        }
      </div>
    </div>
  )

  }else{
    return(
      <div>
        <p>Loading...</p>
      </div>
    )
  }
}


