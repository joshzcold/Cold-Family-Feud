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
      if(json.action === "ping"){
        // server gets the average latency periodically
        ws.current.send(JSON.stringify({action: "pong", id: `${ json.id }`}))
      }else if(json.action === "data"){
        setGame(json.data)
      }else if(json.action === "buzzed"){
        setBuzzed(true)
      }else if(json.action === "clearbuzzers"){
        setBuzzed(false)
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
      <div class="flex flex-col space-y-20">
        <div style={{ width: "100%" }}>
          <TitleLogo insert={game.title_text}/>
        </div>
        <div class="flex flex-col p-5 justify-center text-center space-y-5">
          {buzzerReg != null? 
            <div>
              {!game.title && !game.is_final_round?
                <div class="flex flex-col space-y-12 justify-center">
                  <p class="text-2xl">{game.rounds[game.round].question}</p>
                  {buzzed?
                    <p>BUZZED</p>
                    :
                    <button class="hover:shadow-md rounded-md bg-red-600 p-2" 
                      onClick={()=>{
                        ws.current.send(JSON.stringify({action: "buzz", id: `${buzzerReg}`}))
                      }}>
                      BUZZ
                    </button>
                  }
                  <div class="border-4 rounded p-5 space-y-2 text-center">
                    <h1 class="text-2xl">Buzzer Order</h1>
                    <hr/>
                    <div>
                      {game.buzzed.map((x,i) => 
                      <div key={i} class="flex flex-row space-x-2  text-sm">
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
                </div>
                :
                <div>
                  <h1>
                    {game.is_final_round?
                        "Its the final round, view the game window":"Waiting for host to start"} 
                  </h1>
                </div>
              }
            </div>
            :
            <div>
              <div class="flex flex-col space-y-12">
                <div>
                  <h1 class="text-2xl">Team: {pickedTeam != null?
                      game.teams[pickedTeam].name: "pick your team"}</h1>

                </div>
                <div class="grid grid-cols-2 gap-4">
                  <p class="text-2xl">Name:</p>
                  <input class="border-4 rounded text-center" placeholder="✏️ Joe Family" id="nameInput" />
                  <button class="hover:shadow-md rounded-md bg-blue-200 p-5"
                    onClick={()=>{setPickedTeam(0)}}>
                    {game.teams[0].name}
                  </button>

                  <button class="hover:shadow-md rounded-md bg-blue-200 p-5"
                    onClick={()=>{setPickedTeam(1)}}>
                    {game.teams[1].name}
                  </button>

                </div>
                <div>
                  <button 
                    class="py-8 px-16 hover:shadow-md rounded-md bg-green-200"
                    onClick={()=>{
                      var name = document.getElementById("nameInput").value
                      if(name != null && pickedTeam != null && name !== ""){
                        ws.current.send(JSON.stringify({
                          action: "registerbuzz", team: pickedTeam,
                          name: name
                        }))
                      }else{
                        let errors = []
                        name == null || name === "" ? errors.push("input your name"): null
                        pickedTeam == null? errors.push("pick your team"): null
                        setError(errors.join(" and "))
                      }
                    }}>
                    register
                  </button>

                </div>
                {error != null && error !== ""?
                  <p>👾 {error}</p>:null
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


