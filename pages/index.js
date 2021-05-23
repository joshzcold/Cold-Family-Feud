import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import '../i18n/i18n'
import LanguageSwitcher from "../components/language"
import Admin from "../components/admin"
import Buzzer from "../components/buzzer"
import cookieCutter from 'cookie-cutter'

export default function Home(){
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const [registeredRoomCode, setRegisteredRoomCode] = useState(null)
  const [host, setHost] = useState(false)
  const [game, setGame] = useState({})
  const [team, setTeam] = useState(null)
  const [playerID, setPlayerID] = useState(null)

  const ws = useRef(null)

  function quitGame(){
    if(host){
      // quit the game and log everyone out by deleting the room
    }else{
      // logout of the individual player
    }
  }

  useEffect(() => {
    ws.current = new WebSocket(`ws://${ window.location.hostname }:8080`); 
    ws.current.onopen = function() {
      console.debug("game connected to server", ws.current);
      let session = cookieCutter.get('session')
      if(session != null){
        console.debug("found user session", session)
        ws.current.send(JSON.stringify({action:"get_back_in", session: session}))
      }
    };

    ws.current.onmessage = function (evt) { 
      var received_msg = evt.data;
      let json = JSON.parse(received_msg)
      if(json.action === "host_room"){
        console.debug("registering room with host", json.room)
        setPlayerID(json.id)
        setHost(true)
        setRegisteredRoomCode(json.room)
        setGame(json.game)
        cookieCutter.set('session', `${json.room}:${json.id}`)
      }
      else if (json.action === "join_room"){
        console.debug("Joining room : ", json)
        setPlayerID(json.id)
        setRegisteredRoomCode(json.room)
        setGame(json.game)
        if(json.team != null){setTeam(json.team)}
      }
      else if (json.action === "get_back_in"){
        console.debug("Getting back into room", json)
        if(json.player === "host"){
          setHost(true)
        }
        if(Number.isInteger(json.team)){
          setTeam(json.team)
        }
        setPlayerID(json.id)
        setRegisteredRoomCode(json.room)
        setGame(json.game)
      }
      else if (json.action === "error"){
        console.error(json.message)
        setError(json.message)
      }
      else{
        console.error("did not expect in index.js: ", json)
      }
    };
  }, [])

  function hostRoom(){
    ws.current.send(JSON.stringify({
      action:"host_room"
    }))
  }

  function joinRoom(){
    setError("")
    if(roomCode.length === 4){
      if(playerName.length > 0){
        ws.current.send(JSON.stringify({
          action:"join_room", room: roomCode, name: playerName
        }))
      }else{
        setError(t("input your name"))
      }
    }else{
      setError(t("room code is not correct length, should be 4 characters"))
    }
  }

  if(registeredRoomCode !== null && host){
    return(
      <Admin ws={ws} game={game} 
        id={playerID} setGame={setGame} 
        room={registeredRoomCode} quitGame={quitGame}/>
    )
  }
  else if (registeredRoomCode !== null && ! host){
    return(
      <Buzzer ws={ws} game={game} id={playerID} 
        setGame={setGame} room={registeredRoomCode}
        quitGame={quitGame} setTeam={setTeam} team={team}
      />
    )
  }
  else{
    return (
      <div>
        <Head>
          <title>{t("gameTradeMark")}</title>
          <link rel="icon" href="/dashboard/favicon.svg" ></link>
        </Head>
        <main>
          <div class="h-screen flex flex-col justify-around">
            <div class="flex flex-col mt-12 text-center space-y-20 flex-grow">
              <p class="text-8xl">{t("gameTradeMark")}</p>
              <div class="flex flex-col space-y-20 flex-shrink items-center">
                <div>
                  <div class="flex flex-row justify-between text-2xl px-4">
                    <p class="uppercase">{t("roomCode")}</p>
                  </div>
                  <input class="border-4 border-gray-600 p-4 rounded-2xl text-4xl uppercase" onChange={(e)=>{
                    if(e.target.value.length <= 4) {
                      setRoomCode(e.target.value)
                    }
                  }} value={roomCode} placeholder={t("enter4LetterRoomCode")}></input>
                </div>

                <div>
                  <div class="flex flex-row justify-between text-2xl px-4">
                    <p class="uppercase">{t("name")}</p>
                    <p>{12 - playerName.length}</p>
                  </div>
                  <input class="border-4 border-gray-600 p-4 rounded-2xl text-4xl uppercase" onChange={(e)=>{
                    if(e.target.value.length <= 12){
                      setPlayerName(e.target.value)
                    }
                  }} value={playerName} placeholder={t("enterYourName")}></input>
                </div>

                <button 
                  class="shadow-md rounded-md bg-blue-200 py-8 w-1/2 text-2xl uppercase"                onClick={() => {
                    joinRoom() 
                  }}>
                  {t("play")}
                </button>
              </div>
              {error !== ""?
                <p class="text-2xl text-red-700">{error}</p>:null
              }
            </div>

            <div class="p-8 bg-blue-400">
              <div class="flex flex-row items-center justify-around">
                <LanguageSwitcher/>
                <button 
                  class="shadow-md rounded-md bg-gray-300 p-4 text-2xl uppercase" 
                  onClick={() => {
                    hostRoom()
                  }}>
                  {t("host")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

