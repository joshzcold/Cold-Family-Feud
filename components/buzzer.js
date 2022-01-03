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

let timerInterval = null;

export default function Buzzer(props) {
  const { i18n, t } = useTranslation();
  const [buzzed, setBuzzed] = useState(false);
  const [buzzerReg, setBuzzerReg] = useState(null);
  const [error, setError] = useState();
  const [timer, setTimer] = useState(0);
  let refreshCounter = 0;

  let game = props.game;
  let ws = props.ws;

  const send = function(data) {
    data.room = props.room;
    data.id = props.id;
    ws.current.send(JSON.stringify(data));
  };

  useEffect(() => {
    setInterval(() => {
      if (ws.current.readyState !== 1) {
        setError(
          `lost connection to server refreshing in ${10 - refreshCounter}`
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

    if (props.id !== null && props.team !== null) {
      setBuzzerReg(props.id);
    }

    ws.current.addEventListener("message", (evt) => {
      let received_msg = evt.data;
      let json = JSON.parse(received_msg);
      if (json.action === "ping") {
        // server gets the average latency periodically
        console.debug(props.id);
        send({ action: "pong", id: props.id });
      } else if (json.action === "quit") {
        props.setGame(null);
        props.setTeam(null);
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
        <button
          class="shadow-md rounded-lg p-2 bg-gray-200 text-1xl font-bold uppercase absolute top-1 right-1"
          onClick={() => {
            send({ action: "quit" });
          }}
        >
          {t("quit")}
        </button>
        {buzzerReg !== null ? (
          <>
            {!game.title && !game.is_final_round ? (
              <div class="pt-8 flex flex-col space-y-5">
                <Round game={game} />

                {/* Buzzer Section TODO replace with function*/}
                <div class="" style={{ width: "100%", textAlign: "center" }}>
                  {buzzed ? (
                    <img
                      style={{ width: "50%", display: "inline-block" }}
                      src="buzzed.svg"
                    />
                  ) : (
                    <img
                      class="cursor-pointer"
                      style={{ width: "50%", display: "inline-block" }}
                      onClick={() => {
                        send({ action: "buzz", id: props.id });
                      }}
                      src="buzz.svg"
                    />
                  )}
                  <p class="text-gray-400 p-2 italic">
                    buzzer is reset between rounds
                  </p>
                  {error !== "" ? (
                    <p class="text-2xl text-red-700">{error}</p>
                  ) : null}
                </div>
                {/* END Buzzer Section TODO replace with function*/}
                <div class="flex flex-row justify-between min-w-full space-x-3">
                  <TeamName game={game} team={0} />
                  <TeamName game={game} team={1} />
                </div>
                <div class="">
                  <QuestionBoard round={game.rounds[game.round]} />
                </div>
                <div class="border-4 rounded space-y-2 text-center flex-grow w-full">
                  <div class="flex flex-col">
                    {game.buzzed.map((x, i) => (
                      <div
                        key={i}
                        class="flex flex-row space-x-2 md:text-2xl lg:text-2xl text-1xl"
                      >
                        <div class="flex-grow">
                          <p class="truncate w-20 text-left">
                            {t("number", { count: i + 1 })}.{" "}
                            {game.registeredPlayers[x.id].name}
                          </p>
                        </div>
                        <div class="flex-grow">
                          <p class="truncate w-20 text-left">
                            {game.teams[game.registeredPlayers[x.id].team].name}
                          </p>
                        </div>
                        <div class="flex-grow">
                          <p class="truncate w-20 text-left">
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
                    <TitleLogo insert={game.title_text} />
                    <p class="text-3xl text-center py-12">
                      {t("Waiting for host to start")}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <TitleLogo insert={game.title_text} />
            <div class="flex flex-row justify-center">
              <h1 class="text-3xl">
                {t("team")}:{" "}
                {props.team != null
                  ? game.teams[props.team].name
                  : "pick your team"}
              </h1>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button
                class="hover:shadow-md rounded-md bg-blue-200 p-5"
                onClick={() => {
                  cookieCutter.set("session", `${props.room}:${props.id}:0`);
                  props.setTeam(0);
                }}
              >
                {game.teams[0].name}
              </button>

              <button
                class="hover:shadow-md rounded-md bg-blue-200 p-5"
                onClick={() => {
                  cookieCutter.set("session", `${props.room}:${props.id}:1`);
                  props.setTeam(1);
                }}
              >
                {game.teams[1].name}
              </button>
            </div>
            <div class="flex flex-row justify-center">
              <button
                class="py-8 px-16 hover:shadow-md rounded-md bg-green-200 uppercase"
                onClick={() => {
                  if (props.team != null) {
                    send({ action: "registerbuzz", team: props.team });
                  } else {
                    let errors = [];
                    props.team == null
                      ? errors.push(t("pick your team"))
                      : null;
                    setError(errors.join(` ${t("and")} `));
                  }
                }}
              >
                {t("play")}
              </button>
            </div>
            {error != null && error !== "" ? <p>👾 {error}</p> : null}
          </>
        )}
      </>
    );
  } else {
    return (
      <div>
        <p>{t("loading")}</p>
      </div>
    );
  }
}
