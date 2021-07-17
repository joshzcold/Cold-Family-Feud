import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import LanguageSwitcher from "../components/language";
import Admin from "../components/admin";
import Buzzer from "../components/buzzer";
import TitleNoInsert from "../components/title-no-insert";
import cookieCutter from "cookie-cutter";

export default function Home() {
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [registeredRoomCode, setRegisteredRoomCode] = useState(null);
  const [host, setHost] = useState(false);
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState(null);
  const [playerID, setPlayerID] = useState(null);

  const ws = useRef(null);

  function quitGame(host = false) {
    ws.current.send(
      JSON.stringify({
        action: "quit",
        host: host,
        id: playerID,
        room: registeredRoomCode,
      })
    );
  }

  function initalize_ws() {
    console.log("connecting to server");
    fetch("/api/ws").then(() => {
      ws.current = new WebSocket(`wss://${window.location.host}/api/ws`);
      ws.current.onopen = function () {
        console.debug("game connected to server", ws.current);
        let session = cookieCutter.get("session");
        if (session != null) {
          console.debug("found user session", session);
          ws.current.send(
            JSON.stringify({ action: "get_back_in", session: session })
          );
        }
      };

      ws.current.onmessage = function (evt) {
        var received_msg = evt.data;
        let json = JSON.parse(received_msg);
        if (json.action === "host_room") {
          console.debug("registering room with host", json.room);
          setPlayerID(json.id);
          setHost(true);
          setRegisteredRoomCode(json.room);
          setGame(json.game);
          cookieCutter.set("session", `${json.room}:${json.id}`);
        } else if (json.action === "join_room") {
          console.debug("Joining room : ", json);
          setPlayerID(json.id);
          setRegisteredRoomCode(json.room);
          setGame(json.game);
          if (json.team != null) {
            setTeam(json.team);
          }
        } else if (json.action === "quit") {
          console.debug("player quit");
          setPlayerID(null);
          setRegisteredRoomCode(null);
          setGame({});
          setHost(false);
          initalize_ws();
        } else if (json.action === "get_back_in") {
          console.debug("Getting back into room", json);
          if (json.player === "host") {
            setHost(true);
          }
          if (Number.isInteger(json.team)) {
            setTeam(json.team);
          }
          setPlayerID(json.id);
          setRegisteredRoomCode(json.room);
          setGame(json.game);
        } else if (json.action === "error") {
          console.error(json.message);
          setError(json.message);
        } else {
          console.debug("did not expect in index.js: ", json);
        }
      };
    });
  }

  useEffect(() => {
    initalize_ws();
  }, []);

  function hostRoom() {
    console.debug(ws.current);
    if (!ws.current.readyState == 3) {
      initalize_ws();
    }
    ws.current.send(
      JSON.stringify({
        action: "host_room",
      })
    );
  }

  function joinRoom() {
    if (!ws.current.readyState == 3) {
      initalize_ws();
    }
    setError("");
    if (roomCode.length === 4) {
      if (playerName.length > 0) {
        ws.current.send(
          JSON.stringify({
            action: "join_room",
            room: roomCode,
            name: playerName,
          })
        );
      } else {
        setError(t("input your name"));
      }
    } else {
      setError(t("room code is not correct length, should be 4 characters"));
    }
  }

  console.debug(game);
  if (registeredRoomCode !== null && host && game != null) {
    return (
      <Admin
        ws={ws}
        game={game}
        id={playerID}
        setGame={setGame}
        room={registeredRoomCode}
        quitGame={quitGame}
      />
    );
  } else if (registeredRoomCode !== null && !host && game != null) {
    return (
      <Buzzer
        ws={ws}
        game={game}
        id={playerID}
        setGame={setGame}
        room={registeredRoomCode}
        quitGame={quitGame}
        setTeam={setTeam}
        team={team}
      />
    );
  } else {
    return (
      <>
        <Head>
          <title>{t("gameTradeMark")}</title>
          <link rel="icon" href="x.svg"></link>
        </Head>
        <main>
          <div class="flex flex-col items-center pt-12 space-y-5 h-screen">
            <div class="w-1/2">
              <TitleNoInsert />
            </div>
            <div class="flex flex-col space-y-12 flex-grow items-center">
              <div>
                <div class="flex flex-row justify-between text-1xl px-2">
                  <p class="uppercase">{t("room code")}</p>
                </div>
                <input
                  class="border-4 border-gray-600 p-2 rounded-2xl text-2xl uppercase"
                  onChange={(e) => {
                    if (e.target.value.length <= 4) {
                      setRoomCode(e.target.value);
                    }
                  }}
                  value={roomCode}
                  placeholder={t("4 letter room code")}
                ></input>
              </div>

              <div>
                <div class="flex flex-row justify-between text-1xl px-2">
                  <p class="uppercase">{t("name")}</p>
                  <p>{12 - playerName.length}</p>
                </div>
                <input
                  class="border-4 border-gray-600 p-2 rounded-2xl text-2xl uppercase"
                  onChange={(e) => {
                    if (e.target.value.length <= 12) {
                      setPlayerName(e.target.value);
                    }
                  }}
                  value={playerName}
                  placeholder={t("enter your name")}
                ></input>
              </div>

              <button
                class="shadow-md rounded-md bg-blue-200 py-4 w-2/3 text-2xl uppercase"
                onClick={() => {
                  joinRoom();
                }}
              >
                {t("play")}
              </button>
              {error !== "" ? (
                <p class="text-2xl text-red-700">{error}</p>
              ) : null}
              <div class="bg-blue-400 flex-grow p-5 w-screen">
                <div class="flex flex-row  h-full items-center justify-around">
                  <LanguageSwitcher />
                  <button
                    class="shadow-md rounded-md bg-gray-300 p-4 text-2xl uppercase"
                    onClick={() => {
                      hostRoom();
                    }}
                  >
                    {t("host")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
