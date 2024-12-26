import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Title from "components/title";
import Round from "components/round";
import TeamName from "components/team-name.js";
import QuestionBoard from "components/question-board.js";
import Final from "components/final";
import "tailwindcss/tailwind.css";
import cookieCutter from "cookie-cutter";

let timerInterval = null;

export default function Game(props) {
  const { i18n, t } = useTranslation();
  const [game, setGame] = useState({});
  const [timer, setTimer] = useState(0);
  const [error, setErrorVal] = useState("");
  const [showMistake, setShowMistake] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const ws = useRef(null);
  let refreshCounter = 0;

  function setError(e) {
    setErrorVal(e);
    setTimeout(() => {
      setErrorVal("");
    }, 5000);
  }

  useEffect(() => {
    fetch("/api/ws").finally(() => {
      ws.current = new WebSocket(`wss://${window.location.host}/api/ws`);
      ws.current.onopen = function() {
        console.log("game connected to server");
        let session = cookieCutter.get("session");
        console.debug(session);
        if (session != null) {
          console.debug("found user session", session);
          ws.current.send(
            JSON.stringify({ action: "game_window", session: session }),
          );
          setInterval(() => {
            console.debug("sending pong in game window");
            let [room, id] = session.split(":");
            ws.current.send(
              JSON.stringify({ action: "pong", id: id, room: room }),
            );
          }, 5000);
        }
      };

      ws.current.onmessage = function(evt) {
        var received_msg = evt.data;
        let json = JSON.parse(received_msg);
        console.debug(json);
        if (json.action === "data") {
          if (json.data.title_text === "Change Me") {
            json.data.title_text = t("Change Me");
          }
          if (json.data.teams[0].name === "Team 1") {
            json.data.teams[0].name = `${t("team")} ${t("number", {
              count: 1,
            })}`;
          }
          if (json.data.teams[1].name === "Team 2") {
            json.data.teams[1].name = `${t("team")} ${t("number", {
              count: 2,
            })}`;
          }
          setGame(json.data);
          let session = cookieCutter.get("session");
          let [_, id] = session.split(":");
          if (json.data?.registeredPlayers[id] == "host") {
            setIsHost(true);
          }
        } else if (
          json.action === "mistake" ||
          json.action === "show_mistake"
        ) {
          var audio = new Audio("wrong.mp3");
          audio.play();
          setShowMistake(true);
          setTimeout(() => {
            setShowMistake(false);
          }, 2000);
        } else if (json.action === "quit") {
          setGame({});
          window.close();
        } else if (json.action === "reveal") {
          var audio = new Audio("good-answer.mp3");
          audio.play();
        } else if (json.action === "final_reveal") {
          var audio = new Audio("fm-answer-reveal.mp3");
          audio.play();
        } else if (json.action === "duplicate") {
          var audio = new Audio("duplicate.mp3");
          audio.play();
        } else if (json.action === "final_submit") {
          var audio = new Audio("good-answer.mp3");
          audio.play();
        } else if (json.action === "final_wrong") {
          var audio = new Audio("try-again.mp3");
          audio.play();
        } else if (json.action === "set_timer") {
          setTimer(json.data);
        } else if (json.action === "stop_timer") {
          clearInterval(timerInterval);
        } else if (json.action === "start_timer") {
          let limit = json.data;
          timerInterval = setInterval(() => {
            if (limit > 0) {
              limit = limit - 1;
              setTimer(limit);
            } else {
              var audio = new Audio("try-again.mp3");
              audio.play();
              clearInterval(timerInterval);
              setTimer(json.data);
              // Send timer stop to admin.js
              let session = cookieCutter.get("session");
              let [room, id] = session.split(":");
              
              ws.current.send(JSON.stringify({
                action: "timer_complete",
                room: room,
                id: id
              }));
            }
          }, 1000);
        } else if (json.action === "change_lang") {
          console.debug("Language Change", json.data);
          i18n.changeLanguage(json.data);
        } else {
          console.error("didn't expect", json);
        }
      };

      setInterval(() => {
        if (ws.current.readyState !== 1) {
          setError(
            `lost connection to server refreshing in ${5 - refreshCounter}`,
          );
          refreshCounter++;
          if (refreshCounter >= 5) {
            console.debug("game reload()");
            location.reload();
          }
        } else {
          setError("");
        }
      }, 1000);
    });
  }, []);

  if (game.teams != null) {
    let gameSession;
    if (game.title) {
      gameSession = <Title game={game} />;
    } else if (game.is_final_round) {
      gameSession = (
        <div className="flex w-full justify-center">
          <div className="lg:w-5/6 sm:w-11/12 sm:px-8 md:w-4/6 w-11/12 flex flex-col space-y-6 py-20">
            <Final game={game} timer={timer} />
          </div>
        </div>
      );
    } else {
      gameSession = (
        <div className="flex flex-col space-y-10 py-20 px-10">
          <Round game={game} />
          <QuestionBoard round={game.rounds[game.round]} />
          <div className="flex flex-row justify-around">
            <TeamName game={game} team={0} />
            <TeamName game={game} team={1} />
          </div>
        </div>
      );
    }

    if (typeof window !== "undefined") {
      document.body.className = game?.settings?.theme + " bg-background";
    }
    return (
      <>
        {!isHost ? (
          <div className="w-screen flex flex-col items-end absolute">
            <button
              className="shadow-md rounded-lg m-1 p-2 bg-secondary-500 hover:bg-secondary-200 font-bold uppercase"
              onClick={() => {
                cookieCutter.set("session", "");
                window.location.href = "/";
              }}
            >
              {t("quit")}
            </button>
          </div>
        ) : null}
        <div className="min-h-screen absolute w-screen flex flex-col items-center justify-center pointer-events-none">
          <img
            className={`w-4/12 ${showMistake ? "opacity-90" : "opacity-0"} transition-opacity ease-in-out duration-300`}
            src="x.svg"
          />
        </div>
        <div className={`${game?.settings?.theme} min-h-screen`}>
          <div className="">
            {gameSession}
            {error !== "" ? (
              <p className="text-2xl text-failure-700">{error}</p>
            ) : null}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p>{t("No game session. retry from the admin window")}</p>
      </div>
    );
  }
}
