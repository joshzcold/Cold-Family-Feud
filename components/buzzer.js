import { useState, useEffect, useRef } from "react";
import TitleLogo from "./title-logo";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import cookieCutter from "cookie-cutter";
import Round from "./round";
import QuestionBoard from "./question-board.js";
import TeamName from "./team-name.js";
import Final from "./final";
import { ERROR_CODES } from "i18n/errorCodes";

let timerInterval = null;

export default function Buzzer(props) {
  const { i18n, t } = useTranslation();
  const [buzzed, setBuzzed] = useState(false);
  const [buzzerReg, setBuzzerReg] = useState(null);
  const [error, setErrorVal] = useState("");
  const [timer, setTimer] = useState(0);
  const [showMistake, setShowMistake] = useState(false);
  let refreshCounter = 0;

  function setError(e) {
    setErrorVal(e);
    setTimeout(() => {
      setErrorVal("");
    }, 5000);
  }

  let game = props.game;
  let ws = props.ws;

  const send = function(data) {
    data.room = props.room;
    data.id = props.id;
    ws.current.send(JSON.stringify(data));
  };

  const playBuzzerSound = () => {
    const audio = new Audio("buzzer.wav");
    audio.play().catch(error => {
      console.warn('Error playing buzzer sound:', error);
    });
  };

  useEffect(() => {
    cookieCutter.set("session", `${props.room}:${props.id}:0`);
    setInterval(() => {
      if (ws.current.readyState !== 1) {
        setError(
          t(ERROR_CODES.CONNECTION_LOST, {message: `${10 - refreshCounter}`}),
        );
        refreshCounter++;
        if (refreshCounter >= 10) {
          console.debug("buzzer reload()");
          location.reload();
        }
      } else {
        setError("");
      }
    }, 1000);

    ws.current.addEventListener("message", (evt) => {
      let received_msg = evt.data;
      let json = JSON.parse(received_msg);
      if (json.action === "ping") {
        // server gets the average latency periodically
        console.debug(props.id);
        send({ action: "pong", id: props.id });
      } else if (json.action === "mistake" || json.action === "show_mistake") {
        var audio = new Audio("wrong.mp3");
        audio.play();
        if (json.action === "mistake" || json.action === "show_mistake") {
          setShowMistake(true);
          setTimeout(() => {
            setShowMistake(false);
          }, 2000);
        }
      } else if (json.action === "quit") {
        props.setGame(null);
        props.setTeam(null);
        location.reload();
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
            clearInterval(timerInterval);
            setTimer(json.data);
          }
        }, 1000);
      } else if (json.action === "data") {
        if (json.data.title_text === "Change Me") {
          json.data.title_text = t("Change Me");
        }
        if (json.data.teams[0].name === "Team 1") {
          json.data.teams[0].name = `${t("team")} ${t("number", { count: 1 })}`;
        }
        if (json.data.teams[1].name === "Team 2") {
          json.data.teams[1].name = `${t("team")} ${t("number", { count: 2 })}`;
        }
        props.setGame(json.data);
      } else if (json.action === "buzzed") {
        setBuzzed(true);
      } else if (json.action === "clearbuzzers") {
        setBuzzed(false);
      } else if (json.action === "change_lang") {
        console.debug("Language Change", json.data);
        i18n.changeLanguage(json.data);
      } else if (json.action === "registered") {
        console.debug(props.id);
        send({ action: "pong", id: props.id });
        setBuzzerReg(props.id);
      } else {
        console.debug("didnt expect action in buzzer: ", json);
      }
    });
  }, []);

  if (game.teams != null) {
    console.debug(game);
    return (
      <>
        <img
          className={`lg:w-1/2 sm:w-10/12 md:w-3/4 w-11/12 top-2/4 pointer-events-none ${
            showMistake ? "opacity-90" : "opacity-0"
            } transition-opacity ease-in-out duration-300 absolute`}
          src="x.svg"
        />
        <button
          className="shadow-md rounded-lg p-2 bg-secondary-900 hover:bg-secondary-300 text-1xl font-bold uppercase w-24 self-end"
          onClick={() => {
            send({ action: "quit" });
          }}
        >
          {t("quit")}
        </button>
        {buzzerReg !== null ? (
          <>
            {!game.title && !game.is_final_round ? (
              <div className="pt-8 flex flex-col space-y-5">
                <Round game={game} />

                {/* Buzzer Section TODO replace with function*/}
                <div
                  className=""
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {buzzed ? (
                    <img
                      style={{ width: "50%", display: "inline-block" }}
                      src="buzzed.svg"
                    />
                  ) : (
                      <img
                        className="cursor-pointer"
                        style={{ width: "50%", display: "inline-block" }}
                        onClick={() => {
                          send({ action: "buzz", id: props.id });
                          // Play sound based on settings
                          if (game.settings.enable_player_buzzer_sound) {
                            if (!game.settings.first_buzzer_sound_only || game.buzzed.length === 0) {
                              playBuzzerSound();
                            }
                          }
                        }}
                        src="buzz.svg"
                      />
                    )}
                  <p className="text-secondary-900 p-2 italic">
                    {t("buzzer is reset between rounds")}
                  </p>
                  {error !== "" ? (
                    <p className="text-2xl text-failure-700">{error}</p>
                  ) : null}
                </div>
                {/* END Buzzer Section TODO replace with function*/}
                <div className="flex flex-row justify-between min-w-full space-x-3">
                  <TeamName game={game} team={0} />
                  <TeamName game={game} team={1} />
                </div>
                <div className="">
                  <QuestionBoard round={game.rounds[game.round]} />
                </div>
                <div className="border-4 rounded space-y-2 text-center flex-grow w-full">
                  <div className="flex flex-col">
                    {game.buzzed.map((x, i) => (
                      <div
                        key={i}
                        className="flex flex-row space-x-2 md:text-2xl lg:text-2xl text-1xl"
                      >
                        <div className="flex-grow">
                          <p className="truncate w-20 text-left text-foreground">
                            {t("number", { count: i + 1 })}.{" "}
                            {game.registeredPlayers[x.id].name}
                          </p>
                        </div>
                        <div className="flex-grow">
                          <p className="truncate w-20 text-left text-foreground">
                            {game.teams[game.registeredPlayers[x.id].team].name}
                          </p>
                        </div>
                        <div className="flex-grow">
                          <p className="truncate w-20 text-left text-foreground">
                            {t("number", {
                              count: (
                                ((x.time - game.tick) / 1000) %
                                60
                              ).toFixed(2),
                            })}{" "}
                            {t("second")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
                <>
                  {game.is_final_round ? (
                    <div>
                      <Final game={game} timer={timer} />
                    </div>
                  ) : (
                      <div>
                        {props.game.settings.logo_url ? (
                            <div className="mx-auto max-w-md w-full">
                              <img className="w-full h-[300px] min-h-[200px] object-contain" src={`${props.game.settings.logo_url}`} 
                              alt="Game logo"/>
                            </div>
                        ) : (
                            <TitleLogo insert={props.game.title_text} />
                          )}
                        <p className="text-3xl text-center py-12 text-foreground">
                          {t("Waiting for host to start")}
                        </p>
                      </div>
                    )}
                </>
              )}
          </>
        ) : (
            <>
              {props.game.settings.logo_url ? (
                  <div className="mx-auto max-w-md w-full">
                    <img className="w-full h-[300px] min-h-[200px] object-contain" src={`${props.game.settings.logo_url}`} 
                    alt="Game logo"/>
                  </div>
              ) : (
                  <TitleLogo insert={props.game.title_text} />
                )}
              <div className="flex flex-row justify-center">
                <h1 className="text-3xl text-foreground">
                  {t("team")}:{" "}
                  {props.team != null
                    ? game.teams[props.team].name
                    : t("pick your team")}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`hover:shadow-md rounded-md bg-primary-200 p-5 ${props.team === 0 ? 'border-2 border-sky-600' : ''}`}
                  onClick={() => {
                    props.setTeam(0);
                  }}
                >
                  {game.teams[0].name}
                </button>

                <button
                  className={`hover:shadow-md rounded-md bg-primary-200 p-5 ${props.team === 1 ? 'border-2 border-sky-600' : ''}`}
                  onClick={() => {
                    props.setTeam(1);
                  }}
                >
                  {game.teams[1].name}
                </button>
              </div>
              <div className="flex flex-row justify-center">
                <button
                  disabled={props.team === null}
                  className={`py-8 px-16 hover:shadow-md rounded-md bg-success-200 uppercase font-bold ${props.team === null ? 'opacity-50 hover:shadow-none cursor-not-allowed': ''}`}
                  onClick={() => {
                    if (props.team != null) {
                      send({ action: "registerbuzz", team: props.team });
                    } 
                  }}
                >
                  {t("play")}
                </button>
              </div>
              <div className="flex flex-row justify-center">
                <a href="/game">
                  <button
                    className="py-4 px-8 hover:shadow-md rounded-md bg-secondary-300"
                    onClick={() => {
                      send({ action: "registerspectator", team: props.team });
                    }}
                  >
                    {t("Open Game Window")}
                  </button>
                </a>
              </div>
              {error != null && error !== "" ? <p>👾 {error}</p> : null}
            </>
          )}
      </>
    );
  } else {
    return (
      <div>
        <p className="text-foreground">{t("loading")}</p>
      </div>
    );
  }
}
