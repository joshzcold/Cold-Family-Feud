import { useState, useEffect, useRef } from 'react';
import TitleLogo from "../components/title-logo"
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import '../i18n/i18n'

export default function Buzzer(props){
  const { i18n, t } = useTranslation();
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
        if(json.data.title_text === "Change Me"){
          json.data.title_text = t("changeMe")
        }
        if(json.data.teams[0].name === "Team 1"){
          json.data.teams[0].name = `${ t("team") } ${t("number",{count:1})}`
        }
        if(json.data.teams[1].name === "Team 2"){
          json.data.teams[1].name = `${ t("team") } ${t("number",{count:2})}`
        }
        setGame(json.data)
      }else if(json.action === "buzzed"){
        setBuzzed(true)
      }else if(json.action === "clearbuzzers"){
        setBuzzed(false)
      }else if (json.action === "change_lang"){
        console.debug("Language Change", json.data)
        i18n.changeLanguage(json.data)
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
      <div class="flex flex-col space-y-12">
        <div class="flex flex-col p-5 justify-center text-center space-y-5">
          {buzzerReg != null? 
            <div>
              {!game.title && !game.is_final_round?
                <div class="flex flex-col space-y-12 justify-center">
                  <p class="text-2xl">{game.rounds[game.round].question}</p>
                  <div class="flex-grow" style={{width: "100%", textAlign:"center"}}>
                    {buzzed?
                      <img style={{width: "50%", display: "inline-block"}} src="buzzed.svg"/>
                      :
                      <img class="cursor-pointer" style={{width: "50%", display: "inline-block"}} onClick={() => {
                        ws.current.send(JSON.stringify({action: "buzz", id: `${buzzerReg}`}))
                      }} src="buzz.svg"/>

                    }
                  </div>
                  <div class="border-4 rounded p-5 space-y-2 text-center">
                    <h1 class="text-2xl">{t("buzzerOrder")}</h1>
                    <hr/>
                    <div>
                      {game.buzzed.map((x,i) => 
                      <div key={i} class="flex flex-row space-x-2  text-sm">
                        <div class="flex-grow">
                          <p class="truncate">
                            {t("number",{count: i+1})}. {game.registeredPlayers[x.id].name}
                          </p>
                        </div>
                        <div class="flex-grow">
                          <p class="truncate w-20">
                            {game.teams[game.registeredPlayers[x.id].team].name}
                          </p>
                        </div>
                        <div class="flex-grow">
                          <p class="">
                            {t("number",{count:(((x.time - game.tick)/1000) % 60).toFixed(2)})} {t("second")}
                          </p>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
                :
                <div class="flex flex-col min-h-screen justify-center items-center align-middle">
                  <div>
                  <p class="flex-grow text-2xl">
                    {game.is_final_round?  t("buzzerFinalRoundHelpText"):t("buzzerWaiting")} 
                  </p>
                  </div>
                </div>
              }
            </div>
            :
            <div>
              <div class="flex flex-col space-y-12">
                <div class="" >
                  <TitleLogo insert={game.title_text}/>
                </div>
                <div>
                  <h1 class="text-2xl">{t("team")}: {pickedTeam != null?
                      game.teams[pickedTeam].name: "pick your team"}</h1>

                </div>
                <div class="grid grid-cols-2 gap-4">
                  <p class="text-2xl">{ t("name") }:</p>
                  <input class="border-4 rounded text-center" placeholder={ `${t("randomName")}` } id="nameInput" />
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
                        name == null || name === "" ? errors.push(t("buzzerNameError")): null
                        pickedTeam == null? errors.push(t("buzzerTeamError")): null
                        setError(errors.join(` ${t("and")} `))
                      }
                    }}>
                    {t("register")}
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
        <p>{t("loading")}</p>
      </div>
    )
  }
}


