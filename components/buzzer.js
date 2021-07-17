import { useState, useEffect, useRef } from "react";
import TitleLogo from "./title-logo";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import cookieCutter from "cookie-cutter";

export default function Buzzer(props) {
  const { i18n, t } = useTranslation();
  const [buzzed, setBuzzed] = useState(false);
  const [buzzerReg, setBuzzerReg] = useState(null);
  const [error, setError] = useState();
  let refreshCounter = 0;

  let game = props.game;
  let ws = props.ws;

  const send = function (data) {
    data.room = props.room;
    data.id = props.id;
    ws.current.send(JSON.stringify(data));
  };

  useEffect(() => {
    setInterval(() => {
      if (ws.current.readyState === 3) {
        setError(
          `lost connection to server refreshing in ${10 - refreshCounter}`
        );
        refreshCounter++;
        if (refreshCounter >= 10) {
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
      } else if (json.action === "data") {
        if (json.data.title_text === "Change Me") {
          json.data.title_text = t("changeMe");
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
      <div class="flex flex-col space-y-12">
        <button
          class="shadow-md absolute top-3 right-3 rounded-lg p-2 bg-gray-200 text-sm uppercase"
          onClick={() => {
            send({ action: "quit" });
          }}
        >
          {t("quit")}
        </button>
        <div class="flex flex-col p-5 justify-center text-center space-y-5">
          {buzzerReg !== null ? (
            <div>
              {!game.title && !game.is_final_round ? (
                <div class="flex flex-col space-y-12 justify-center">
                  <p class="text-2xl">{game.rounds[game.round].question}</p>
                  <div
                    class="flex-grow"
                    style={{ width: "100%", textAlign: "center" }}
                  >
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
                    {error !== "" ? (
                      <p class="text-2xl text-red-700">{error}</p>
                    ) : null}
                  </div>
                  <div class="border-4 rounded p-5 space-y-2 text-center">
                    <h1 class="text-2xl">{t("buzzerOrder")}</h1>
                    <hr />
                    <div>
                      {game.buzzed.map((x, i) => (
                        <div key={i} class="flex flex-row space-x-2  text-sm">
                          <div class="flex-grow">
                            <p class="truncate">
                              {t("number", { count: i + 1 })}.{" "}
                              {game.registeredPlayers[x.id].name}
                            </p>
                          </div>
                          <div class="flex-grow">
                            <p class="truncate w-20">
                              {
                                game.teams[game.registeredPlayers[x.id].team]
                                  .name
                              }
                            </p>
                          </div>
                          <div class="flex-grow">
                            <p class="">
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
                <div class="flex flex-col min-h-screen justify-center items-center align-middle">
                  <div class="flex flex-col space-y-12">
                    <TitleLogo insert={game.title_text} />
                    <p class="flex-grow text-2xl">
                      {game.is_final_round
                        ? t("buzzerFinalRoundHelpText")
                        : t("buzzerWaiting")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div class="flex flex-col space-y-12">
                <div class="">
                  <TitleLogo insert={game.title_text} />
                </div>
                <div>
                  <h1 class="text-2xl">
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
                      cookieCutter.set(
                        "session",
                        `${props.room}:${props.id}:0`
                      );
                      props.setTeam(0);
                    }}
                  >
                    {game.teams[0].name}
                  </button>

                  <button
                    class="hover:shadow-md rounded-md bg-blue-200 p-5"
                    onClick={() => {
                      cookieCutter.set(
                        "session",
                        `${props.room}:${props.id}:1`
                      );
                      props.setTeam(1);
                    }}
                  >
                    {game.teams[1].name}
                  </button>
                </div>
                <div>
                  <button
                    class="py-8 px-16 hover:shadow-md rounded-md bg-green-200 uppercase"
                    onClick={() => {
                      if (props.team != null) {
                        send({ action: "registerbuzz", team: props.team });
                      } else {
                        let errors = [];
                        props.team == null
                          ? errors.push(t("buzzerTeamError"))
                          : null;
                        setError(errors.join(` ${t("and")} `));
                      }
                    }}
                  >
                    {t("play")}
                  </button>
                </div>
                {error != null && error !== "" ? <p>👾 {error}</p> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>{t("loading")}</p>
      </div>
    );
  }
}
