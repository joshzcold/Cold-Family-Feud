import { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import Players from "./Admin/players";
import LanguageSwitcher from "./language";

function debounce(callback, wait = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}

function TitleMusic() {
  const { i18n, t } = useTranslation();
  return (
    <div class="flex flex-row items-center space-x-5  p-5">
      <h3 class="text-2xl ">{t("titleMusic")}</h3>
      <audio controls>
        <source src="title.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

function TeamControls(props) {
  const { i18n, t } = useTranslation();
  return (
    <>
      <button
        disabled={props.pointsGivin.state}
        class={`border-4 text-2xl ${props.pointsGivin.color} rounded p-10 ${props.pointsGivin.textColor}`}
        onClick={() => {
          props.game.teams[props.team].points =
            props.game.point_tracker[props.game.round] +
            props.game.teams[props.team].points;
          props.setPointsGivin({
            state: true,
            color: "bg-black-200",
            textColor: "text-gray-300",
          });
          props.setGame((prv) => ({ ...prv }));
          props.send({ action: "data", data: props.game });
        }}
      >
        {t("team")} {t("number", { count: props.team + 1 })}:{" "}
        {props.game.teams[props.team].name} {t("getsPoints")}
      </button>
      <button
        class="border-4 bg-red-200 text-2xl rounded p-10"
        onClick={() => {
          if (props.game.teams[props.team].mistakes < 3)
            props.game.teams[props.team].mistakes++;
          props.setGame((prv) => ({ ...prv }));
          props.send({ action: "data", data: props.game });
          props.send({
            action: "mistake",
            data: props.game.teams[props.team].mistake,
          });
        }}
      >
        {t("team")} {t("number", { count: props.team + 1 })}:{" "}
        {props.game.teams[props.team].name} {t("mistake")}
      </button>
    </>
  );
}

export default function Admin(props) {
  const { i18n, t } = useTranslation();

  const [pointsGivin, setPointsGivin] = useState({
    state: false,
    color: "bg-green-200",
    textColor: "text-black",
  });
  const [gameSelector, setGameSelector] = useState([]);
  const [error, setError] = useState("");
  let ws = props.ws;
  let game = props.game;
  let refreshCounter = 0;
  let pongInterval;

  function send(data) {
    data.room = props.room;
    data.id = props.id;
    console.debug(data);
    ws.current.send(JSON.stringify(data));
  }

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

    pongInterval = setInterval(() => {
      console.debug("sending pong in admin");
      send({ action: "pong" });
    }, 5000);

    ws.current.addEventListener("message", (evt) => {
      var received_msg = evt.data;
      let json = JSON.parse(received_msg);
      if (json.action === "data") {
        props.setGame(json.data);
      } else if (json.action === "change_lang") {
        console.debug("Language Change", json.data);
        if (json.games != null) {
          setGameSelector(json.games);
        } else {
          setGameSelector([]);
        }
      } else if (json.action === "error") {
        console.error(json.message);
        setError(json.message);
      } else {
        console.debug("did not expect admin: ", json);
      }
    });
    send({ action: "change_lang", data: i18n.language });
    return () => clearInterval(pongInterval);
  }, []);

  if (game.teams != null) {
    let current_screen;
    if (game.title) {
      current_screen = t("title");
    } else if (game.is_final_round && !game.is_final_second) {
      current_screen = `${t("finalRound")} ${t("number", { count: 1 })}`;
    } else if (game.is_final_round && game.is_final_second) {
      current_screen = `${t("finalRound")} ${t("number", { count: 2 })}`;
    } else {
      current_screen = `${t("round")} ${t("number", {
        count: game.round + 1,
      })}`;
    }

    if (game.rounds != null) {
      // var put it into function scope
      var current_round = game.rounds[game.round];
      console.debug("This is current round", current_round);
    }

    const disabledButton = {
      opacity: '50%',
    };

    return (
      <div style={{ minWidth: "100vh" }}>
        <div class="min-w-full">
          {/* ROOM CODE TEXT */}
          <p class="text-center text-8xl p-4 font-semibold uppercase">
            {props.room}
          </p>
          <hr />
          <div class="flex flex-row justify-evenly p-5 ">
            {/* ADMIN BUTTONS */}
            <div class="w-48 hover:shadow-md rounded bg-green-200 p-2 flex justify-center">
              <a href="/game" target="_blank">
                <button class="text-2xl">{t("Open Game Window")}</button>
              </a>
            </div>
            <div class="w-48 hover:shadow-md rounded bg-blue-200 p-2 flex justify-center">
              <a href="/new">
                <button class="text-2xl">{t("newGame")}</button>
              </a>
            </div>
            <div class="hover:shadow-md rounded bg-red-200 p-2 w-32 flex justify-center">
              <button
                class="text-2xl"
                onClick={() => {
                  props.quitGame(true);
                }}
              >
                {t("Quit")}
              </button>
            </div>
          </div>
          <div class="flex flex-row justify-evenly items-center m-5">
            <LanguageSwitcher
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                send({ action: "change_lang", data: e.target.value });
              }}
            />
            {/* START GAME LOADER */}
            <div class="flex flex-col border-2  rounded">
              <div class="justify-center flex flex-row  space-x-5 p-2 items-center transform translate-y-3">
                {gameSelector.length > 0 ? (
                  <select
                    class="border-2 rounded"
                    onChange={(e) => {
                      send({
                        action: "load_game",
                        file: e.target.value,
                        lang: i18n.language,
                      });
                    }}
                  >
                    <option disabled selected value></option>
                    {gameSelector.map((value, index) => (
                      <option key={index} value={value}>
                        {value.replace(".json", "")}
                      </option>
                    ))}
                  </select>
                ) : null}
                <div class="image-upload w-6">
                  <label htmlFor="gamePicker">
                    <svg
                      class="fill-current text-gray-400 hover:text-gray-600 cursor-pointer"
                      viewBox="0 0 384 512"
                    >
                      <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                    </svg>
                  </label>
                  <input
                    class="hidden"
                    type="file"
                    accept=".json"
                    id="gamePicker"
                    onChange={(e) => {
                      var file = document.getElementById("gamePicker").files[0];
                      console.debug(file);
                      if (file) {
                        var reader = new FileReader();
                        reader.readAsText(file, "utf-8");
                        reader.onload = function (evt) {
                          let data = JSON.parse(evt.target.result);
                          console.debug(data);
                          // TODO some error checking for invalid game data
                          send({ action: "load_game", data: data });
                        };
                        reader.onerror = function (evt) {
                          console.error("error reading file");
                        };
                      }
                    }}
                  />
                </div>
              </div>
              <div class="flex flex-row">
                <span class="translate-x-3 px-2 text-black text-opacity-50 flex-shrink inline translate-y-3 transform bg-white ">
                  {t("loadGame")}
                </span>
                <div class="flex-grow" />
              </div>
            </div>
          </div>
          {/* END GAME LOADER */}
        </div>

        <hr />
        <div class="pt-5">
          {/* TITLE TEXT INPUT */}
          <div class="grid grid-cols-3 gap-5 px-12 justify-items-start">
            <p class="text-2xl">{t("titleText")}:</p>
            <input
              class="border-4 rounded text-4xl w-80 col-span-2"
              onChange={debounce((e) => {
                game.title_text = e.target.value;
                props.setGame((prv) => ({ ...prv }));
                send({ action: "data", data: game });
              })}
              placeholder={t("myFamilyPlaceHolder")}
              defaultValue={game.title_text}
            ></input>
            <p class="text-2xl">{t("Team 1")}:</p>
            <div class="w-80 flex-row items-center col-span-2">
              {/* TEAM 1 NAME CHANGER */}
              <input
                class="border-4 rounded text-4xl w-60"
                onChange={debounce((e) => {
                  game.teams[0].name = e.target.value;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                })}
                placeholder={t("teamNamePlaceHolder")}
                defaultValue={game.teams[0].name}
              ></input>
              {/* TEAM 1 POINTS CHANGER */}
              <input
                type="number"
                min="0"
                required
                class="border-4 text-4xl rounded text-center w-20"
                onChange={(e) => {
                  let number = parseInt(e.target.value);
                  console.debug(number);
                  isNaN(number) ? (number = 0) : null;
                  game.teams[0].points = number;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                }}
                value={game.teams[0].points}
              ></input>
            </div>
            <p class="text-2xl">{t("Team 2")}:</p>
            <div class="w-80 flex-row items-center col-span-2">
              {/* TEAM 2 NAME CHANGER */}
              <input
                class="border-4 rounded text-4xl w-60"
                onChange={debounce((e) => {
                  game.teams[1].name = e.target.value;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                })}
                placeholder={t("teamNamePlaceHolder")}
                defaultValue={game.teams[1].name}
              ></input>
              {/* TEAM 2 POINTS CHANGER */}
              <input
                type="number"
                min="0"
                required
                class="border-4 rounded text-center text-4xl w-20"
                onChange={(e) => {
                  let number = parseInt(e.target.value);
                  isNaN(number) ? (number = 0) : null;
                  game.teams[1].points = number;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                }}
                value={game.teams[1].points}
              ></input>
            </div>
          </div>
        </div>
        {error !== "" ? <p class="text-2xl text-red-700">{error}</p> : null}
        {game.rounds == null ? (
          <p class="text-2xl text-center py-20 text-black text-opacity-50">
            [{t("pleaseLoadGame")}]
          </p>
        ) : (
          <div>
            <div class="flex-col space-y-5 p-5">
              <hr />
              <div class="flex flex-row justify-evenly items-baseline">
                <TitleMusic />
                {/* CURRENT SCREEN TEXT */}
                <p class="text-2xl text-center pt-5">
                  {" "}
                  {t("currentScreen")}: {current_screen}
                </p>
              </div>

              <div class="flex flex-row space-x-10 flex-grow">
                {/* TITLE SCREEN BUTTON */}
                <button
                  class="border-4 rounded p-10 text-2xl flex-grow"
                  onClick={() => {
                    game.title = true;
                    props.setGame((prv) => ({ ...prv }));
                    send({ action: "data", data: game });
                  }}
                >
                  {t("titleCard")}
                </button>

                {/* FINAL ROUND BUTTON */}
                {game.final_round ? (
                  <button
                    class="border-4 rounded p-10 text-2xl flex-grow"
                    onClick={() => {
                      game.title = false;
                      game.is_final_round = true;
                      game.is_final_second = false;
                      props.setGame((prv) => ({ ...prv }));
                      send({ action: "data", data: game });
                      send({
                        action: "set_timer",
                        data: game.final_round_timers[0],
                      });
                    }}
                  >
                    {t("finalRound")}
                  </button>
                ) : null}

                {/* ROUND SELECTOR */}
                <select
                  class="border-4 rounded p-10 text-2xl flex-grow"
                  value={game.round}
                  onChange={(e) => {
                    game.round = parseInt(e.target.value);
                    game.is_final_round = false;
                    game.is_final_second = false;
                    game.teams[0].mistakes = 0;
                    game.teams[1].mistakes = 0;
                    game.title = false;
                    props.setGame((prv) => ({ ...prv }));
                    setPointsGivin({
                      state: false,
                      color: "bg-green-200",
                      textColor: "text-black",
                    });
                    send({ action: "data", data: game });
                  }}
                >
                  {game.rounds.map((key, index) => (
                    <option value={index}>
                      {t("round")} {t("number", { count: index + 1 })}
                    </option>
                  ))}
                </select>
              </div>
              {/* START ROUND 1 BUTTON */}
              <div class="flex flex-row space-x-10">
                <button
                  class="border-4 rounded p-10 flex-grow text-2xl"
                  onClick={() => {
                    game.title = false;
                    game.is_final_round = false;
                    game.is_final_second = false;
                    game.round = 0;
                    props.setGame((prv) => ({
                      ...prv,
                    }));
                    setPointsGivin({
                      state: false,
                      color: "bg-green-200",
                      textColor: "text-black",
                    });
                    send({ action: "data", data: game });
                  }}
                >
                  {t("startRoundOne")}
                </button>

                {/* NEXT ROUND BUTTON */}
                <button
                  class="border-4 rounded p-10 flex-grow text-2xl"
                  onClick={() => {
                    game.title = false;
                    game.is_final_round = false;
                    game.is_final_second = false;
                    game.teams[0].mistakes = 0;
                    game.teams[1].mistakes = 0;
                    if (game.round < game.rounds.length - 1) {
                      game.round = game.round + 1;
                    }
                    props.setGame((prv) => ({ ...prv }));
                    setPointsGivin({
                      state: false,
                      color: "bg-green-200",
                      textColor: "text-black",
                    });
                    console.debug(game.round);
                    send({ action: "data", data: game });
                  }}
                >
                  {t("nextRound")}
                </button>
              </div>

              {/* GETS POINTS MISTAKE */}
              <div class="grid grid-rows-2 grid-flow-col gap-5">
                <TeamControls
                  game={game}
                  setGame={props.setGame}
                  team={0}
                  send={send}
                  setPointsGivin={setPointsGivin}
                  pointsGivin={pointsGivin}
                />
                <TeamControls
                  game={game}
                  setGame={props.setGame}
                  send={send}
                  team={1}
                  setPointsGivin={setPointsGivin}
                  pointsGivin={pointsGivin}
                />
              </div>
            </div>
            <hr />

            {/* IS NOT THE FINAL ROUND */}
            {!game.is_final_round ? (
              // GAME BOARD CONTROLS
              <div>
                <div class="flex flex-row justify-between space-x-5 px-10 items-center pt-5">
                  {/* QUESTION */}
                  <p class="text-3xl font-bold">{current_round.question}</p>
                  {/* POINT TRACKER */}
                  <div class="flex flex-row border-4 p-2 items-center space-x-5">
                    <h3 class="text-xl">{t("Points")}: </h3>
                    <h3 class="text-2xl flex-grow">
                      {t("number", { count: game.point_tracker[game.round] })}
                    </h3>
                    <h3 class="text-xl">
                      x{t("number", { count: current_round.multiply })}
                    </h3>
                  </div>
                </div>

                {/* GAME BOARD BUTTONS */}
                <div class=" text-white rounded border-4 grid grid-rows-4 grid-flow-col  p-3 mx-10 mt-5 gap-3 ">
                  {current_round.answers.map((x) => (
                    <div
                      class={`${
                        x.trig ? "bg-gray-600" : "bg-blue-600"
                      } font-extrabold uppercase rounded border-2 text-2xl rounded `}
                    >
                      <button
                        class="flex flex-row p-5 justify-center min-h-full items-center min-w-full"
                        onClick={() => {
                          x.trig = !x.trig;
                          props.setGame((prv) => ({ ...prv }));

                          if (x.trig) {
                            game.point_tracker[game.round] =
                              game.point_tracker[game.round] +
                              x.pnt * current_round.multiply;
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "reveal" });
                          } else {
                            game.point_tracker[game.round] =
                              game.point_tracker[game.round] -
                              x.pnt * current_round.multiply;
                            props.setGame((prv) => ({ ...prv }));
                          }
                          send({ action: "data", data: game });
                        }}
                      >
                        <div class="flex-grow">{x.ans}</div>
                        <div class="p-2">{t("number", { count: x.pnt })}</div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* BUZZERS AND PLAYERS */}
                <div class="grid grid-cols-2 gap-4 p-5">
                  <h1 class="text-2xl capitalize">{t("buzzerOrder")}</h1>
                  <h1 class="text-2xl capitalize">{t("players")}</h1>
                  <div class="border-4 h-48 overflow-y-scroll rounded p-5 text-center">
                    <div class="flex flex-col  h-full space-y-2 justify-between">
                      <div class="">
                        {game.buzzed.length > 0 ? (
                          <div class="flex flex-row items-center space-x-5">
                            {/* active clear buzzers button */}
                            <button
                              class="border-4 bg-red-200 hover:bg-red-400 rounded p-2"
                              onClick={() => {
                                send({ action: "clearbuzzers" });
                              }}
                            >
                              {t("clearBuzzers")}
                            </button>
                            <p class="text-black text-opacity-50">
                              {t("buzzerHelpText")}
                            </p>
                          </div>
                        ) : (
                          <div class="flex flex-row items-center space-x-5">
                            {/* disabled clear buzzers button */}
                            <button class="text-2xl border-4 bg-gray-300 rounded p-2">
                              {t("clearBuzzers")}
                            </button>
                            <p class="text-black text-opacity-50">
                              {t("buzzerHelpText")}
                            </p>
                          </div>
                        )}
                      </div>
                      <hr />
                      <div class="flex-grow">
                        {game.buzzed.map((x, i) => (
                          <div class="flex flex-row space-x-5 justify-center">
                            <p>
                              {t("number", { count: i + 1 })}.{" "}
                              {game.registeredPlayers[x.id].name}
                            </p>
                            <p>
                              {t("team")}:{" "}
                              {
                                game.teams[game.registeredPlayers[x.id].team]
                                  .name
                              }
                            </p>
                            <p>
                              {t("time")}:{" "}
                              {(((x.time - game.tick) / 1000) % 60).toFixed(2)}{" "}
                              {t("seconds")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Players game={game} ws={ws} room={props.room} />
                </div>
              </div>
            ) : (
              // FINAL ROUND
              <div>
                <div class="p-5">
                  {/* FINAL ROUND TEXT */}
                  <h2 class="text-6xl text-center">
                    {t("finalRound")}{" "}
                    {t("number", { count: game.is_final_second ? "2" : "1" })}
                  </h2>
                  <div class="flex py-5 items-center flex-row justify-evenly">
                    {/* START FINAL ROUND 2 */}
                    {!game.is_final_second ? (
                      <button
                        class="border-4 rounded p-5 text-3xl"
                        onClick={() => {
                          console.debug(game);
                          game.is_final_second = true;
                          game.gameCopy = JSON.parse(
                            JSON.stringify(game.final_round)
                          );
                          game.final_round.forEach((rnd) => {
                            rnd.selection = 0;
                            rnd.points = 0;
                            rnd.input = "";
                            rnd.revealed = false;
                            rnd.selection = 0;
                          });
                          props.setGame((prv) => ({ ...prv }));
                          send({ action: "data", data: game });
                          send({
                            action: "set_timer",
                            data: game.final_round_timers[1],
                          });
                        }}
                      >
                        {t("start")} {t("finalRound")}{" "}
                        {t("number", { count: 2 })}
                      </button>
                    ) : (
                      <div class="flex py-5 items-center flex-row justify-evenly space-x-5">
                        {/* GO BACK TO FINAL ROUND 1 */}
                        <button
                          class="border-4 rounded p-5 text-3xl"
                          onClick={() => {
                            game.is_final_round = true;
                            game.is_final_second = false;
                            game.final_round.forEach((rnd, index) => {
                              rnd.input = game.gameCopy[index]?.input;
                              rnd.points = game.gameCopy[index]?.points;
                              rnd.revealed = true;
                              rnd.selection = game.gameCopy[index]?.selection;
                            });
                            game.gameCopy = [];
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                            send({
                              action: "set_timer",
                              data: game.final_round_timers[0],
                            });
                          }}
                        >
                          {t("backTo")} {t("finalRound")}{" "}
                          {t("number", { count: 1 })}
                        </button>
                        {game.is_final_second ? (
                          <div>
                            {/* REVEAL FIRST ROUND ANSWERS */}
                            {game.hide_first_round ? (
                              <button
                                class="border-4 rounded p-5 text-3xl"
                                onClick={() => {
                                  game.hide_first_round = false;
                                  props.setGame((prv) => ({ ...prv }));
                                  send({ action: "data", data: game });
                                }}
                              >
                                {t("revealFirstRoundAnswers")}
                              </button>
                            ) : (
                              // HIDE FIRST ROUND ANSWERS
                              <button
                                class="border-4 rounded p-5 text-3xl"
                                onClick={() => {
                                  game.hide_first_round = true;
                                  props.setGame((prv) => ({ ...prv }));
                                  send({ action: "data", data: game });
                                }}
                              >
                                {t("hideFirstRoundAnswers")}
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div class="flex py-5 items-center flex-row justify-evenly">
                    {/* START TIMER */}
                    <button
                      class="border-4 rounded p-5 text-3xl"
                      onClick={() => {
                        if (game.is_final_second) {
                          send({
                            action: "start_timer",
                            data: game.final_round_timers[1],
                          });
                        } else {
                          send({
                            action: "start_timer",
                            data: game.final_round_timers[0],
                          });
                        }
                      }}
                    >
                      {t("startTimer")}
                    </button>

                    {/* STOP TIMER */}
                    <button
                      class="border-4 rounded p-5 text-3xl"
                      onClick={() => {
                        send({ action: "stop_timer" });
                      }}
                    >
                      {t("stopTimer")}
                    </button>
                  </div>

                  {/* FINAL ROUND QUESTIONS AND ANSWERS */}
                  {game.final_round?.map((x, index) => (
                    <div class="flex-col flex space-y-5 p-12 border-2">
                      <p class="text-4xl font-bold ">{x.question}</p>
                      {game.is_final_second? (
                       <div class="text-2xl font-bold">
                       First round answer: {'gameCopy' in game ? game.gameCopy[index].input : ""}
                       <button
                           class="border-4 rounded p-3 text-2xl flex-grow float-right bg-red-200"
                           onClick={() => {
                             send({ action: "final_wrong" });
                           }}
                         >
                           {t("wrong")}
                         </button>
                       </div>
                      ):(
                        <div></div>
                      )}
                      <div class="flex flex-row space-x-5 pb-7">
                        {/* ANSWER SELECTION FINAL ROUND */}
                        <input
                          class="border-4 rounded text-3xl w-48 p-5 flex-grow"
                          placeholder={t("answer")}
                          value={x.input}
                          onChange={(e) => {
                            x.input = e.target.value;
                            props.setGame((prv) => ({ ...prv }));
                          }}
                        />
                        <select
                          value={x.selection}
                          class="border-4 rounded p-2 text-2xl flex-grow"
                          onChange={(e) => {
                            x.selection = parseInt(e.target.value);
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                          }}
                        >
                          {x.answers.map((key, index) => (
                            <option value={index}>
                              {x.answers[index][0]} {x.answers[index][1]}
                            </option>
                          ))}
                        </select>
                        {/* FINAL ROUND ANSWER BUTTON GROUP */}
                      </div>
                      <div class="flex flex-row ">
                        <button
                          class="border-4 rounded p-5 text-3xl flex-grow"
                          disabled = {!x.revealed}
                          style = {x.revealed ? {} : disabledButton}
                          onClick={() => {
                            x.points = 0;
                            x.revealed_points = true;
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                            send({ action: "final_wrong" });
                          }}
                        >
                          {t("wrong")}
                        </button>

                        <button
                          class="border-4 rounded p-5 text-3xl flex-grow"
                          onClick={() => {
                            x.revealed = true;
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                            send({ action: "final_reveal" });
                          }}
                        >
                          {t("revealAnswer")}
                        </button>

                        <button
                          class="border-4 rounded p-5 text-3xl flex-grow"
                          disabled = {!x.revealed}
                          style = {x.revealed ? {} : disabledButton}
                          onClick={() => {
                            x.points = x.answers[x.selection][1];
                            x.revealed_points = true;
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                            send({ action: "final_submit" });
                          }}
                        >
                          {t("submit")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
