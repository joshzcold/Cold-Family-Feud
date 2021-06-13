import { useState, useEffect, useRef } from 'react';
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import '../i18n/i18n'
import Players from './Admin/players'
import LanguageSwitcher from "./language"

export default function Admin(props){
  const { i18n, t } = useTranslation();

  const [pointsGivin, setPointsGivin] = useState({state: false, color:"bg-green-200", textColor:"text-black"})
  const [gameSelector, setGameSelector] = useState([])
  const [error, setError] = useState("")
  let ws = props.ws
  let game = props.game
  let refreshCounter = 0 

  function send(data){
    data.room = props.room
    data.id = props.id
    console.log(data)
    ws.current.send(JSON.stringify(data))
  }

  useEffect(() => {
    setInterval(() => {
      if(ws.current.readyState === 3){
        setError(`lost connection to server refreshing in ${10 - refreshCounter}`)
        refreshCounter++ 
        if(refreshCounter >= 10){
          location.reload()
        }
      }else{
        setError("")
      }
    }, 1000)
    ws.current.addEventListener("message", (evt)=>{
      var received_msg = evt.data;
      let json = JSON.parse(received_msg)
      if(json.action === "data"){
        props.setGame(json.data)
      }
      else if (json.action === "change_lang"){
        console.debug("Language Change", json.data)
        if(json.games != null){
          setGameSelector(json.games)
        }else{
          setGameSelector([])
        }
      }
      else if (json.action === "error"){
        console.error(json.message)
        setError(json.message)
      }
      else{
        console.debug("did not expect admin: ", json)
      }
    }) 
    send({action:"change_lang", data: i18n.language})
  }, [])

  if(game.teams != null){
    let current_screen 
    if(game.title){
      current_screen = t("title")
    } 
    else if(game.is_final_round &&  ! game.is_final_second){
      current_screen = `${t("finalRound")} ${t("number",{ count: 1 })}` 
    }
    else if(game.is_final_round &&  game.is_final_second){
      current_screen = `${t("finalRound")} ${t("number",{ count: 2 })}` 
    }
    else{
      current_screen = `${t("round")}${t("number",{count: game.round + 1})}`
    }

    if(game.rounds != null){
      // var put it into function scope
      var current_round = game.rounds[game.round]
      console.debug("This is current round", current_round)
    }
    return (
      <div >

        <div class="py-8 px-10 ">
          <div class="flex flex-row space-x-5">
            <p>{t("language")}:</p>
            <LanguageSwitcher onChange={(e) => {
              i18n.changeLanguage(e.target.value)
              send({ action: "change_lang", data: e.target.value })
            }}/>
          </div>
          <div class="flex flex-row items-center justify-between">

            <div class="flex flex-row  space-x-5">
              <div class="flex-grow">
                <a href="/game" target="_blank" >
                  <button class="hover:shadow-md rounded-md bg-green-200 p-2">
                    {t("Open Game Window")}
                  </button>
                </a>
              </div>
              <div class="flex-grow">
                <a href="/new">
                  <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                    {t("newGame")}
                  </button>
                </a>
              </div>
              <button class="hover:shadow-md rounded-md bg-red-200 p-2"
                onClick={() => {
                  props.quitGame(true)
                }}>
                {t("Quit")}
              </button>

            </div>
            <div class="flex flex-col border-2  rounded-lg">
              <div class="justify-center flex flex-row  space-x-5 p-2 items-center transform translate-y-3">
                {gameSelector.length > 0?
                  <select class="border-2 rounded" onChange={(e) => {
                    send({
                      action: "load_game",
                      file: e.target.value, lang: i18n.language
                    })
                  }} >
                    <option disabled selected value></option>
                    {gameSelector.map((value, index) => <option key={index} value={value}>
                      {value.replace(".json","")}
                    </option>)}
                  </select>: null
                }
                <div class="image-upload w-6">
                  <label htmlFor="gamePicker">
                    <svg class="fill-current text-gray-400 hover:text-gray-600 cursor-pointer" viewBox="0 0 384 512" >
                      <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                    </svg>
                  </label>
                  <input class="hidden" type="file" accept=".json" id="gamePicker" onChange={(e) => {
                    var file = document.getElementById("gamePicker").files[0];
                    console.log(file)
                    if (file) {
                      var reader = new FileReader();
                      reader.readAsText(file, 'utf-8');
                      reader.onload = function (evt) {
                        let data = JSON.parse(evt.target.result)
                        console.debug(data)
                        // TODO some error checking for invalid game data
                        send({ action: "load_game", data: data })
                      }
                      reader.onerror = function (evt) {
                        console.error("error reading file")
                      }
                    }
                  }}/>
                </div>
              </div>
              <div class="flex flex-row">
                <span class="translate-x-3 px-2 text-black text-opacity-50 flex-shrink inline translate-y-3 transform bg-white ">
                  {t("loadGame")}
                </span>
                <div class="flex-grow"/>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="flex flex-row justify-between items-end space-x-16 px-10">
            <div class="flex flex-col space-y-5">
              <p class="text-2xl">{t("titleText")}</p>
              <input class="border-4 rounded" onChange={(e)=>{
                game.title_text = e.target.value
                props.setGame(prv => ({ ...prv }));
                send({action: "data", data: game})
              }} placeholder={t("myFamilyPlaceHolder")}></input>
            </div>
            <div class="border-2 rounded text-center">
              <p class="text-4xl p-4 font-semibold uppercase">{props.room}</p>
              <p class="text-2xl px-2 uppercase text-gray-400">{t("room code")}</p>
            </div>

          </div>
          <div class="px-10 py-5">
            <p class="text-black text-opacity-50 ">"{t("titleHelp")}"</p>
          </div>
          <div class="flex flex-row space-x-10 px-10 py-1">
            <p class="text-2xl">{t("teamOneName")}:</p>
            <input class="border-4 rounded" onChange={(e)=>{
              game.teams[0].name = e.target.value
              props.setGame(prv => ({ ...prv }));
              send({action: "data", data: game})
            }} placeholder={t("teamNamePlaceHolder")}></input>
            <div class="flex flex-row">
              <p class="text-2xl">{t("points")}:</p>
              <input type="number" min="0" required class="border-4 rounded" onChange={(e)=>{
                let number = parseInt(e.target.value)
                console.log(number)
                isNaN(number)? number = 0: null
                game.teams[0].points = number
                props.setGame(prv => ({ ...prv }));
                send({action: "data", data: game})
              }} value={game.teams[0].points}></input>
            </div>
          </div>
          <div class="flex flex-row space-x-10 px-10 py-1">
            <p class="text-2xl">{t("teamTwoName")}:</p>
            <input class="border-4 rounded" onChange={(e)=>{
              game.teams[1].name = e.target.value
              props.setGame(prv => ({ ...prv }));
              send({action: "data", data: game})
            }} placeholder={t("teamNamePlaceHolder")}></input>
            <div class="flex flex-row">
              <p class="text-2xl">{t("points")}:</p>
              <input type="number" min="0" required class="border-4 rounded" onChange={(e)=>{
                let number = parseInt(e.target.value)
                isNaN(number)? number = 0: null
                game.teams[1].points = number
                props.setGame(prv => ({ ...prv }));
                send({action: "data", data: game})
              }} value={game.teams[1].points}></input>
            </div>
          </div>
        </div>
        <p class="text-4xl text-center pt-5"> {t("currentScreen")}: {current_screen}</p>
        {error !== ""?
          <p class="text-2xl text-red-700">{error}</p>:null
        }
        {game.rounds == null?
          <p class="text-2xl text-center py-20 text-black text-opacity-50">
            [{t("pleaseLoadGame")}]
          </p>:
            <div>
              <div class="flex-row space-x-16 space-y-5">
                <h2 class="text-2xl p-5">{t("controls")}</h2>

                <button class="border-4 rounded-lg p-2" onClick={() => {
                  game.title = false
                  game.is_final_round = false
                  game.is_final_second = false
                  game.round = 0
                  props.setGame(prv => ({
                    ...prv
                  }))
                  setPointsGivin({state: false, color:"bg-green-200", textColor: "text-black"})
                  send({action: "data", data: game})
                }}>{t("startRoundOne")}</button>

                <button class="border-4 rounded-lg p-2" onClick={() => {
                  game.title = false
                  game.is_final_round = false
                  game.is_final_second = false
                  game.teams[0].mistakes = 0
                  game.teams[1].mistakes = 0
                  if(game.round < game.rounds.length -1){
                    game.round = game.round + 1
                  }
                  props.setGame(prv => ({ ...prv }))
                  setPointsGivin({state: false, color:"bg-green-200", textColor: "text-black"})
                  console.log(game.round)
                  send({action: "data", data: game})
                }}>{t("nextRound")}</button>

                <select class="border-4 rounded-lg p-2"  value={game.round} onChange={(e) => {
                  game.round = parseInt(e.target.value)
                  game.is_final_round = false
                  game.is_final_second = false
                  game.teams[0].mistakes = 0
                  game.teams[1].mistakes = 0
                  game.title = false
                  props.setGame(prv => ({ ...prv }))
                  setPointsGivin({state: false, color:"bg-green-200", textColor: "text-black"})
                  send({action: "data", data: game})
                }}>
                  {game.rounds.map(( key, index ) =>
                  <option value={index}>{t("round")} {t("number",{count: index +1})}</option>)}
                </select>
                <button class="border-4 rounded-lg p-2" onClick={() => {
                  game.title = true
                  props.setGame(prv => ({ ...prv }))
                  send({action: "data", data: game})
                }}>{t("titleCard")}</button>

                {game.final_round?
                  <button class="border-4 rounded-lg p-2" onClick={() => {
                    game.title = false
                    game.is_final_round = true
                    game.is_final_second = false
                    props.setGame(prv => ({ ...prv }))
                    send({action: "data", data: game})
                    send({action: "set_timer", data: game.final_round_timers[0]})
                  }}>{t("finalRound")}</button>: null
                }

                <button disabled={pointsGivin.state} 
                  class={`border-4 ${pointsGivin.color} rounded-lg p-2 ${pointsGivin.textColor}`}
                  onClick={() =>{
                    game.teams[0].points=game.point_tracker[game.round] + game.teams[0].points
                    setPointsGivin({state: true, color:"bg-black-200", textColor: "text-gray-300"})
                    props.setGame(prv => ({ ...prv }))
                    send({action: "data", data: game})
                  }}>{t("team")} {t("number", {count: 1})}: {game.teams[0].name} {t("getsPoints")}</button>
                <button disabled={pointsGivin.state} 
                  class={`border-4 ${pointsGivin.color} rounded-lg p-2 ${pointsGivin.textColor}`}
                  onClick={() =>{
                    game.teams[1].points=game.point_tracker[game.round] + game.teams[1].points
                    setPointsGivin({state: true, color:"bg-black-200", textColor: "text-gray-300"})
                    props.setGame(prv => ({ ...prv }))
                    send({action: "data", data: game})
                  }}>{t("team")} {t("number", {count: 2})}: {game.teams[1].name} {t("getsPoints")}</button>
                <button class="border-4 bg-red-200 rounded-lg p-2" onClick={() =>{
                  if(game.teams[0].mistakes < 3) game.teams[0].mistakes++;
                  props.setGame(prv => ({ ...prv }))
                  send({action: "data", data: game})
                  send({action: "mistake", data: game.teams[0].mistake})
                }}>{t("team")} {t("number", {count: 1})}: {game.teams[0].name} {t("mistake")}</button>
                <button class="border-4 bg-red-200 rounded-lg p-2" onClick={() =>{
                  if(game.teams[1].mistakes < 3) game.teams[1].mistakes++;
                  props.setGame(prv => ({ ...prv }))
                  send({action: "data", data: game})
                  send({action: "mistake", data: game.teams[1].mistake})
                }}>{t("team")} {t("number", {count: 2})}: {game.teams[1].name} {t("mistake")}</button>
              </div>
              <div class="flex flex-row items-center space-x-5  p-5">
                <h3 class="text-2xl ">{t("titleMusic")}</h3>
                <audio controls>
                  <source src="title.mp3" type="audio/mpeg"/>
                </audio>
              </div>

              {!game.is_final_round?
                <div>
                  <div class="grid grid-cols-2 gap-4 p-5">
                    <h1 class="text-2xl capitalize">{t("buzzerOrder")}</h1>
                    <h1 class="text-2xl capitalize">{t("players")}</h1>
                    <div class="border-4 h-48 overflow-y-scroll rounded p-5 text-center">
                      <div class="flex flex-col  h-full space-y-2 justify-between">
                        <div class="">
                          {game.buzzed.length > 0?
                            <div class="flex flex-row items-center space-x-5">
                              {/* active clear buzzers button */}
                              <button class="border-4 bg-red-200 hover:bg-red-400 rounded-lg p-2" onClick={() => {
                                send({action: "clearbuzzers"})
                              }} >
                                {t("clearBuzzers")}
                              </button>
                              <p class="text-black text-opacity-50">{t("buzzerHelpText")}</p>
                            </div>
                            :
                            <div class="flex flex-row items-center space-x-5">
                              {/* disabled clear buzzers button */}
                              <button class="border-4 bg-gray-300 rounded-lg p-2" >
                                {t("clearBuzzers")}
                              </button>
                              <p class="text-black text-opacity-50">{t("buzzerHelpText")}</p>
                            </div>
                          }
                        </div>
                        <hr/>
                        <div class="flex-grow">
                          {game.buzzed.map((x,i) => 
                          <div class="flex flex-row space-x-5 justify-center">
                            <p>{t("number", {count: i+1})}. {game.registeredPlayers[x.id].name}</p>
                            <p>{t("team")}: {game.teams[game.registeredPlayers[x.id].team].name}</p>
                            <p>{t("time")}: {(((x.time - game.tick)/1000) % 60).toFixed(2)} {t("seconds")}</p>
                          </div>
                          )}

                        </div>
                      </div>
                    </div>
                    <Players game={game} ws={ws} room={props.room}/>
                  </div>
                  <div class="text-center">
                    <h2 class="text-2xl p-2 ">{t("gameBoard")}</h2>
                    <div class="text-center flex flex-row space-x-5 justify-center py-5">
                      <h3 class="text-2xl">{t("question")}:</h3>
                      <p class="text-xl">{current_round.question}</p>
                    </div>
                    <div class="flex flex-row items-center space-x-5 justify-center pb-2">
                      <h3 class="text-xl">{t("multiplier")} {t("number",{count:current_round.multiply})}x</h3>
                      <h3 class="text-xl">{t("pointTracker")}: {t("number", { count: game.point_tracker[game.round] })}</h3>
                    </div>
                  </div>
                  <div class=" text-white rounded border-4 grid grid-rows-4 grid-flow-col  p-3 mx-10 mb-10 mt-5 gap-3 ">
                    {current_round.answers.map(x => 
                    <div class="bg-blue-600 flex font-extrabold uppercase items-center text-center rounded border-2">
                      <button class="border-2 flex-grow rounded p-5" onClick={() => {
                        x.trig = !x.trig
                        props.setGame(prv => ({ ...prv }))

                        if(x.trig){
                          game.point_tracker[game.round] = game.point_tracker[game.round] + x.pnt * current_round.multiply
                          props.setGame(prv => ({ ...prv }))
                          send({action: "reveal"})
                        }else{
                          game.point_tracker[game.round] = game.point_tracker[game.round] - x.pnt * current_round.multiply
                          props.setGame(prv => ({ ...prv }))
                        }
                        send({action: "data", data: game})
                      }}>
                        {x.ans} {t("number",{count:x.pnt})}
                        {x.trig?
                          <span> - {t("answered")}</span>:null
                        }
                      </button>
                    </div>
                    )}
                  </div>
                </div>
                :
                <div>
                  <div>
                    <div class="flex py-5 items-center flex-row space-x-5">
                      <h2 class="text-2xl px-5">
                        {t("finalRound")} {t("number",{count: game.is_final_second? "2": "1"})}
                      </h2>
                      {!game.is_final_second?
                        <button class="border-4 rounded-lg p-2" onClick={() => {
                          console.log(game)
                          game.is_final_second = true
                          game.gameCopy = JSON.parse(JSON.stringify(game.final_round));
                          game.final_round.forEach(rnd => {
                            rnd.selection = 0
                            rnd.points = 0
                            rnd.input = ""
                            rnd.revealed = false
                            rnd.selection = 0
                          })
                          props.setGame(prv => ({ ...prv }))
                          send({action: "data", data: game})
                          send({action: "set_timer", data: game.final_round_timers[1]})
                        }}>{t("start")} {t("finalRound")} {t("number", {count: 2})}</button>
                        :
                        <button class="border-4 rounded-lg p-2" onClick={() => {
                          game.is_final_round = true
                          game.is_final_second = false
                          game.final_round.forEach(( rnd, index ) => {
                            rnd.input = game.gameCopy[index]?.input
                            rnd.points = game.gameCopy[index]?.points
                            rnd.revealed = true
                            rnd.selection = game.gameCopy[index]?.selection 
                          })
                          game.gameCopy = []
                          props.setGame(prv => ({ ...prv }))
                          send({action: "data", data: game})
                          send({action: "set_timer", data: game.final_round_timers[0]})
                        }}>{t("backTo")} {t("finalRound")} {t("number",{count: 1})}</button>
                      }

                      <button class="border-4 rounded-lg p-2" onClick={() => {
                        if(game.is_final_second){
                          send({action: "start_timer", data: game.final_round_timers[1]})
                        }else{
                          send({action: "start_timer", data: game.final_round_timers[0]})
                        }
                      }}>{t("startTimer")}</button>

                      <button class="border-4 rounded-lg p-2" onClick={() => {
                        send({action: "stop_timer"})
                      }}>{t("stopTimer")}</button>

                      {game.is_final_second? 
                        <div>
                          {game.hide_first_round?
                            <button class="border-4 rounded-lg p-2" onClick={() => {
                              game.hide_first_round = false
                              props.setGame(prv => ({ ...prv }))
                              send({action: "data", data: game})
                            }}>{t("revealFirstRoundAnswers")}</button>
                            :
                            <button class="border-4 rounded-lg p-2" onClick={() => {
                              game.hide_first_round = true
                              props.setGame(prv => ({ ...prv }))
                              send({action: "data", data: game})
                            }}>{t("hideFirstRoundAnswers")}</button>
                          }
                        </div>:null
                      }
                    </div>

                    {game.final_round?.map(x =>
                    <div class="px-5">
                      <p class="text-xl pb-1">{x.question}</p>
                      <div class="flex flex-row space-x-10 pb-7">
                        <input class="border-4 rounded" placeholder={t("answer")} value={x.input} onChange={(e) => {
                          x.input = e.target.value
                          props.setGame(prv => ({ ...prv }))
                        }}/>
                        <select value={x.selection} class="border-4 rounded-lg p-2" onChange={(e) => {
                          x.selection = parseInt(e.target.value)
                          props.setGame(prv => ({ ...prv }))
                          send({action: "data", data: game})
                        }}>
                          {x.answers.map((key, index) => <option value={index}>
                            {x.answers[index][0]} {x.answers[index][1]}</option>)}
                        </select>
                        <div class="flex-grow text-right pr-20">
                          <button class="border-4 rounded-lg p-2" onClick={() => {
                            x.points = 0
                            props.setGame(prv => ({ ...prv }))
                            send({action: "data", data: game})
                            send({action: "final_wrong"})
                          }}>{t("wrong")}</button>

                          <button class="border-4 rounded-lg p-2" onClick={() => {
                            x.revealed = true
                            props.setGame(prv => ({ ...prv }))
                            send({action: "data", data: game})
                            send({action: "final_reveal"})
                          }}>{t("revealAnswer")}</button>

                          <button class="border-4 rounded-lg p-2" onClick={() => {
                            x.points = x.answers[x.selection][1]
                            props.setGame(prv => ({ ...prv }))
                            send({action: "data", data: game})
                            send({action: "final_submit"})
                          }}>{t("submit")}</button>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              }

            </div>
        }
      </div>
    )
  } else {
    return(
      <div>
        <p>{t("loading")}</p>
      </div>
    )
  }

}
