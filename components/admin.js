import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import Players from "./Admin/players";
import AdminSettings from "./Admin/settings";
import LanguageSwitcher from "./language";
import CSVLoader from "./Admin/csv-loader";
import { Buffer } from "buffer";
import { BSON } from "bson";
import { handleCsvFile, handleJsonFile } from "utils/files";

function debounce(callback, wait = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      callback.apply(this, args);
    }, wait);
  };
}

function TitleMusic() {
  const { i18n, t } = useTranslation();
  return (
    <div className="flex flex-row items-center space-x-5  p-5">
      <h3 className="text-2xl text-foreground">{t("Title Music")}</h3>
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
        className={`border-4 text-2xl ${props.pointsGivin.color} rounded p-10 ${props.pointsGivin.textColor}`}
        onClick={() => {
          props.game.teams[props.team].points =
            props.game.point_tracker[props.game.round] +
            props.game.teams[props.team].points;
          props.setPointsGivin({
            state: true,
            color: "bg-secondary-500",
            textColor: "text-foreground",
          });
          props.setGame((prv) => ({ ...prv }));
          props.send({ action: "data", data: props.game });
        }}
      >
        {t("team")} {t("number", { count: props.team + 1 })}:{" "}
        {props.game.teams[props.team].name} {t("Gets Points")}
      </button>
      <button
        className="border-4 bg-failure-500 text-2xl rounded p-10 text-foreground"
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

function FinalRoundButtonControls(props) {
  const { i18n, t } = useTranslation();
  const controlRound = props.game.is_final_second
    ? props.game.final_round_2
    : props.game.final_round;
  return controlRound?.map((x, i) => (
    <div key={`round-${i}`} className="flex-col flex space-y-5 p-12 border-2">
      <p className="text-3xl font-bold text-foreground">{x.question}</p>
      {props.game.is_final_second && (
        <div className="flex flex-row space-x-5 pb-2">
          {/* PARTNER'S ANSWER PROVIDED FINAL ROUND */}
          <div className="w-48 flex-grow text-foreground text-3xl p-5 align-middle">
            <i>{t("Partner's Answer")}</i>:{" "}
            {props.game.final_round[i].input || `(${t("No Answer")})`}
          </div>
          {props.game.final_round[i].input && (
            <button
              className="border-4 rounded p-5 text-2xl flex-grow bg-secondary-300 text-foreground"
              onClick={() => props.send({ action: "duplicate" })}
            >
              {t("Already Answered")}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-row space-x-5 pb-2">
        {/* ANSWER PROVIDED FINAL ROUND */}
        <input
          className="border-4 rounded text-2xl w-48 p-5 flex-grow bg-secondary-300 text-foreground placeholder-secondary-900"
          placeholder={t("Answer")}
          value={x.input}
          onChange={(e) => {
            x.input = e.target.value;
            props.setGame((prv) => ({ ...prv }));
          }}
        />

        <button
          className="border-4 rounded p-5 text-2xl flex-grow bg-secondary-300 text-foreground"
          onClick={() => {
            x.revealed = true;
            props.setGame((prv) => ({ ...prv }));
            props.send({ action: "data", data: props.game });
            props.send({ action: "final_reveal" });
          }}
        >
          {t("Reveal Answer")}
        </button>
      </div>
      <div className="flex flex-row space-x-5">
        {/* POINTS AWARDED FINAL ROUND */}
        <select
          value={x.selection}
          className="border-4 rounded w-48 p-5 text-2xl flex-grow bg-secondary-300 text-foreground"
          onChange={(e) => {
            x.selection = parseInt(e.target.value);
            props.setGame((prv) => ({ ...prv }));
            props.send({ action: "data", data: props.game });
          }}
        >
          <option value={-1}>({t("No Answer")}) 0</option>
          {x.answers.map((key, index) => (
            <option key={`answers-${key}`} value={index}>
              {x.answers[index][0]} {x.answers[index][1]}
            </option>
          ))}
        </select>

        <button
          className="border-4 rounded p-5 text-2xl flex-grow bg-secondary-300 text-foreground"
          onClick={() => {
            x.points = x.selection !== -1 ? x.answers[x.selection][1] : 0;
            props.setGame((prv) => ({ ...prv }));
            props.send({ action: "data", data: props.game });
            props.send({
              action: x.selection !== -1 ? "final_submit" : "mistake",
            });
          }}
        >
          {t("Award points")}
        </button>
      </div>
    </div>
  ));
}

function TitleLogoUpload(props) {
  const { i18n, t } = useTranslation();
  if (props.imageUploaded !== null) {
    return (
      <div className="flex flex-row space-x-2 items-center">
        <p className="capitalize text-foreground">logo:</p>
        <img width={"150px"} src={URL.createObjectURL(props.imageUploaded)} />
        <button
          className="border-2 bg-secondary-500 hover:bg-secondary-700 p-1 rounded-lg"
          onClick={(e) => {
            props.send({
              action: "del_logo_upload",
              room: props.room,
            });
            URL.revokeObjectURL(props.imageUploaded);
            props.setImageUploaded(null);
            props.game.settings.logo_url = null;
            props.setGame((prv) => ({ ...prv }));
            props.send({ action: "data", data: props.game });
          }}
        >
          {/* cancel.svg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 717 718"
          >
            <path
              d="M651.22 154c98 139 85 334-40 459s-318 137-458 40c-16-12-34-26-49-40c-15-15-28-32-39-49c-98-139-86-334 39-459s319-137 459-40c16 12 33 26 48 40c15 15 29 32 40 49zm-522 345l370-370c-104-63-242-50-331 39c-90 90-102 228-39 331zm458-280l-370 369c104 63 242 50 331-39c90-90 102-227 39-330z"
              fill="#ffffff"
            />
            <rect
              x="0"
              y="0"
              width="717"
              height="718"
              fill="rgba(0, 0, 0, 0)"
            />
          </svg>
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center space-x-2">
        <div className="image-upload w-6">
          <label htmlFor="logoUpload">
            <svg
              className="fill-current text-secondary-900 hover:text-secondary-500 cursor-pointer"
              viewBox="0 0 384 512"
            >
              <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
            </svg>
          </label>
          <input
            className="hidden"
            type="file"
            accept="image/png, image/jpeg, image/gif"
            id="logoUpload"
            onChange={(e) => {
              var file = document.getElementById("logoUpload").files[0];

              if (file) {
                if (file.size > process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) {
                  console.error("Logo image is too large");
                  props.setError(
                    t("Logo image is too large. 2MB is the limit"),
                  );
                  return;
                }
                var reader = new FileReader();
                let rawData = new ArrayBuffer();
                reader.onload = function(evt) {
                  rawData = evt.target.result;
                  var headerarr = new Uint8Array(evt.target.result).subarray(
                    0,
                    4,
                  );
                  var header = "";
                  for (var i = 0; i < headerarr.length; i++) {
                    header += headerarr[i].toString(16);
                  }
                  let mimetype = "";
                  switch (header) {
                    case "89504e47":
                      mimetype = "png";
                      break;
                    case "47494638":
                      mimetype = "gif";
                      break;
                    case "ffd8ffe0":
                    case "ffd8ffe1":
                    case "ffd8ffe2":
                    case "ffd8ffe3":
                    case "ffd8ffe8":
                      mimetype = "jpeg";
                      break;
                    default:
                      props.setError(t("Unknown file type"));
                      return;
                  }

                  const bufferData = Buffer.from(rawData);
                  props.send({
                    action: "logo_upload",
                    data: bufferData,
                    mimetype: mimetype,
                  });
                  props.setImageUploaded(file);
                  props.game.settings.logo_url = `/rooms/${props.room}/logo.${mimetype}?${new Date().getTime()}`;
                  props.setGame((prv) => ({ ...prv }));
                  props.send({ action: "data", data: props.game });
                };
                reader.readAsArrayBuffer(file);
              }
              document.getElementById("logoUpload").value = null;
            }}
          />
        </div>
        <div>
          <p className="text-s text-secondary-900">{t("logo upload")}</p>
          <p className="text-xs text-secondary-900">
            {t("(must be smaller than 2MB)")}
          </p>
        </div>
      </div>
    );
  }
}

function FinalRoundPointTotalsTextFunction(props) {
  const { i18n, t } = useTranslation();
  let backgroundColor = "bg-secondary-300";
  if (props.isFinalSecond && props.place === 1) {
    backgroundColor = "bg-primary-200";
  } else if (!props.isFinalSecond && props.place === 0) {
    backgroundColor = "bg-primary-200";
  }
  return (
    <div
      className={`flex flex-row space-x-2 text-foreground items-center border-2 rounded-3xl text-2xl p-4 ${backgroundColor} text-foreground`}
    >
      <p className="">{t(props.title)}: </p>
      <p className="">{props.total}</p>
    </div>
  );
}

function FinalRoundPointTotals(props) {
  let roundOneTotal = 0;
  let roundTwoTotal = 0;
  let total = 0;
  props.game.final_round.forEach((round) => {
    console.debug("round one total: ");
    roundOneTotal = roundOneTotal + parseInt(round.points);
  });
  props.game.final_round_2.forEach((round) => {
    console.debug("round two total", total);
    roundTwoTotal = roundTwoTotal + parseInt(round.points);
  });
  total = roundOneTotal + roundTwoTotal;
  return (
    <div className="flex items-center flex-row space-x-5 justify-start py-3">
      <FinalRoundPointTotalsTextFunction
        title="Round one"
        total={roundOneTotal}
        isFinalSecond={props.game.is_final_second}
        place={0}
      />
      <FinalRoundPointTotalsTextFunction
        title="Round two"
        total={roundTwoTotal}
        isFinalSecond={props.game.is_final_second}
        place={1}
      />
      <FinalRoundPointTotalsTextFunction
        title="Total"
        total={total}
        isFinalSecond={props.game.is_final_second}
        place={2}
      />
    </div>
  );
}

function isValidFileType(file, allowedTypes) {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();

  if(!allowedTypes[fileExtension]) {
    return false;
  }

  const mimePattern = allowedTypes[fileExtension].pattern;
  return mimePattern.test(file.type);
}

export default function Admin(props) {
  const { i18n, t } = useTranslation();

  const [pointsGivin, setPointsGivin] = useState({
    state: false,
    color: "bg-success-500",
    textColor: "text-foreground",
  });
  const [gameSelector, setGameSelector] = useState([]);
  const [error, setErrorVal] = useState("");
  const [imageUploaded, setImageUploaded] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [csvFileUpload, setCsvFileUpload] = useState(null);
  const [csvFileUploadText, setCsvFileUploadText] = useState(null);
  let ws = props.ws;
  let game = props.game;
  let refreshCounter = 0;
  let pongInterval;

  function setError(e) {
    setErrorVal(e);
    setTimeout(() => {
      setErrorVal("");
    }, 5000);
  }

  function send(data) {
    data.room = props.room;
    data.id = props.id;
    console.debug(data);
    ws.current.send(JSON.stringify(data));
  }
  function bsonSend(data) {
    data.room = props.room;
    data.id = props.id;
    console.debug(data);
    ws.current.send(BSON.serialize(data));
  }

  useEffect(() => {
    setInterval(() => {
      if (ws.current.readyState !== 1) {
        setError(
          `lost connection to server refreshing in ${10 - refreshCounter}`,
        );
        refreshCounter++;
        if (refreshCounter >= 10) {
          console.debug("admin reload()");
          location.reload();
        }
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
      } else if (json.action === "timer_complete") {
        setTimerStarted(false);
        setTimerCompleted(true);
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
      current_screen = `${t("Final Round")} ${t("number", { count: 1 })}`;
    } else if (game.is_final_round && game.is_final_second) {
      current_screen = `${t("Final Round")} ${t("number", { count: 2 })}`;
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
    return (
      <div
        className="lg:min-w-0"
        style={{
          minWidth: "100vh",
        }}
      >
        <div className="min-h-full">
          {/* ROOM CODE TEXT */}
          <p className="text-center text-8xl p-4 font-semibold uppercase text-foreground">
            {props.room}
          </p>
          <hr />
          <div className="flex flex-row justify-evenly p-5 ">
            {/* ADMIN BUTTONS */}
            <a href="/game" target="_blank">
              <button className="text-2xl">
                <div className="w-48 hover:shadow-md rounded bg-success-200 p-2 flex justify-center">
                  {t("Open Game Window")}
                </div>
              </button>
            </a>
            <a href="/new">
              <button className="text-2xl">
                <div className="w-48 hover:shadow-md rounded bg-primary-200 p-2 flex justify-center">
                  {t("Create New Game")}
                </div>
              </button>
            </a>
            <button
              className="text-2xl"
              onClick={() => {
                props.quitGame(true);
              }}
            >
              <div className="hover:shadow-md rounded bg-failure-200 p-2 w-32 flex justify-center">
                {t("Quit")}
              </div>
            </button>
          </div>
          <div className="flex flex-row justify-evenly items-center m-5">
            <LanguageSwitcher
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                send({ action: "change_lang", data: e.target.value });
              }}
            />
            {/* START GAME LOADER */}
            <div className="flex flex-col border-2  rounded">
              <div className="justify-center flex flex-row  space-x-5 p-2 items-center transform translate-y-3">
                {gameSelector.length > 0 ? (
                  <select
                    className="border-2 rounded bg-secondary-500 text-foreground"
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
                {/* Image Upload */}
                <div className="image-upload w-6">
                  <label htmlFor="gamePicker">
                    <svg
                      className="fill-current text-secondary-900 hover:text-secondary-500 cursor-pointer"
                      viewBox="0 0 384 512"
                    >
                      <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                    </svg>
                  </label>
                  {/* CSV Upload */}
                  <input
                    className="hidden"
                    type="file"
                    accept=".json, .csv"
                    id="gamePicker"
                    onChange={(e) => {
                      var file = document.getElementById("gamePicker").files[0];

                      if (file) {
                        if (file.size > process.env.NEXT_PUBLIC_MAX_CSV_UPLOAD_SIZE_MB * 1024 * 1024) {
                          console.error("This csv file is too large");
                          props.setError(
                            t("This csv file is too large"),
                          );
                          return;
                        }
                      }

                      const allowedTypes = {
                        'json': {
                          pattern: /^application\/(json|.*\+json)$/,
                          handler: (file) => handleJsonFile(file, { 
                            setError, 
                            t, 
                            send 
                          })
                        },
                        'csv': {
                          pattern: /^(text\/csv|application\/(vnd\.ms-excel|csv|x-csv|text-csv))$/,
                          handler: (file) => handleCsvFile(file, { 
                            setError, 
                            t, 
                            setCsvFileUpload, 
                            setCsvFileUploadText 
                          })
                        }
                      };

                      const fileType = isValidFileType(file, allowedTypes);
                      if (!fileType) {
                        setError(t("Unknown file type"));
                        return;
                      }

                      const fileExtension = file.name.toLowerCase().split('.').pop();
                      allowedTypes[fileExtension].handler(file);

                      console.debug(file);

                      // allow same file to be selected again
                      document.getElementById("gamePicker").value = null;
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <span className="translate-x-3 px-2 text-foreground flex-shrink inline translate-y-3 transform bg-background ">
                  {t("Load Game")}
                </span>
                <span className="translate-x-3 px-2 text-secondary-900 flex-shrink inline translate-y-3 transform bg-background ">
                  {t(".json, .csv")}
                </span>
                <div className="flex-grow" />
              </div>
            </div>
          </div>
          {/* END GAME LOADER */}
        </div>

        <hr className="my-12" />
        <div className="flex flex-col items-center space-y-5">
          <div className="grid grid-cols-2 gap-y-10 gap-x-48">
            <div className="flex flex-row justify-between space-x-5">
              {/* TITLE TEXT INPUT */}
              <div className="flex flex-row space-x-5 items-center">
                <p className="text-2xl text-foreground">{t("Title Text")}:</p>
                <input
                  className="border-4 rounded text-2xl w-44 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
                  onChange={debounce((e) => {
                    game.title_text = e.target.value;
                    props.setGame((prv) => ({ ...prv }));
                    send({ action: "data", data: game });
                  })}
                  placeholder={t("My Family")}
                  defaultValue={game.title_text}
                ></input>
              </div>
            </div>
            <TitleLogoUpload
              send={bsonSend}
              room={props.room}
              setGame={props.setGame}
              game={game}
              setError={setError}
              setImageUploaded={setImageUploaded}
              imageUploaded={imageUploaded}
            />
            <div className="w-80 flex-row items-center space-x-1">
              {/* TEAM 1 NAME CHANGER */}
              <input
                className="border-4 rounded text-3xl w-52 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
                onChange={debounce((e) => {
                  game.teams[0].name = e.target.value;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                })}
                placeholder={t("Team Name")}
                defaultValue={game.teams[0].name}
              ></input>
              {/* TEAM 1 POINTS CHANGER */}
              <input
                type="number"
                min="0"
                required
                className="border-4 text-3xl rounded text-center w-20 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
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
            <div className="w-80 flex-row items-center space-x-1">
              {/* TEAM 2 NAME CHANGER */}
              <input
                className="border-4 rounded text-3xl w-52 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
                onChange={debounce((e) => {
                  game.teams[1].name = e.target.value;
                  props.setGame((prv) => ({ ...prv }));
                  send({ action: "data", data: game });
                })}
                placeholder={t("Team Name")}
                defaultValue={game.teams[1].name}
              ></input>
              {/* TEAM 2 POINTS CHANGER */}
              <input
                type="number"
                min="0"
                required
                className="border-4 rounded text-center text-3xl w-20 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
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
          <p className="text-xl text-failure-700">{error}</p>
        </div>
        <hr className="my-12" />
        {/* ADMIN CONTROLS */}
        <div className="flex flex-col items-center">
          <AdminSettings game={game} setGame={props.setGame} send={send} />
        </div>
        {/* SHOW ERRORS TO ADMIN */}
        {game.rounds == null ? (
          <p className="text-2xl text-center py-20 text-secondary-900">
            [{t("Please load a game")}]
          </p>
        ) : (
            <div>
              <div className="flex-col space-y-5 p-5">
                <hr />
                <div className="flex flex-row justify-evenly items-baseline">
                  <TitleMusic />
                  {/* CURRENT SCREEN TEXT */}
                  <p className="text-2xl text-center pt-5 text-foreground">
                    {" "}
                    {t("Current Screen")}: {current_screen}
                  </p>
                </div>

                <div className="flex flex-row space-x-10 flex-grow">
                  {/* TITLE SCREEN BUTTON */}
                  <button
                    className="border-4 rounded p-10 text-2xl flex-grow bg-secondary-300 text-foreground"
                    onClick={() => {
                      game.title = true;
                      game.round = 0;
                      game.is_final_round = false;
                      game.is_final_second = false;
                      props.setGame((prv) => ({ ...prv }));
                      send({ action: "data", data: game });
                    }}
                  >
                    {t("Title Card")}
                  </button>

                  {/* FINAL ROUND BUTTON */}
                  {game.final_round ? (
                    <button
                      className="border-4 rounded p-10 text-2xl flex-grow bg-secondary-300 text-foreground"
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
                      {t("Final Round")}
                    </button>
                  ) : null}

                  {/* ROUND SELECTOR */}
                  <select
                    className="border-4 rounded p-10 text-2xl flex-grow bg-secondary-300 text-foreground"
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
                        color: "bg-success-500",
                        textColor: "text-foreground",
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
                <div className="flex flex-row space-x-10">
                  <button
                    className="border-4 rounded p-10 flex-grow text-2xl bg-secondary-300 text-foreground"
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
                        color: "bg-success-500",
                        textColor: "text-foreground",
                      });
                      send({ action: "data", data: game });
                    }}
                  >
                    {t("Start Round 1")}
                  </button>

                  {/* NEXT ROUND BUTTON */}
                  <button
                    className="border-4 rounded p-10 flex-grow text-2xl bg-secondary-300 text-foreground"
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
                        color: "bg-success-500",
                        textColor: "text-foreground",
                      });
                      console.debug(game.round);
                      send({ action: "data", data: game });
                    }}
                  >
                    {t("Next Round")}
                  </button>
                  <button
                    className="border-4 rounded p-10 flex-grow text-2xl bg-secondary-300 text-foreground flex flex-row justify-center items-center"
                    onClick={() => {
                      send({ action: "show_mistake" });
                    }}
                  >
                    <img className={`w-3/12`} src="x.svg" />
                  </button>
                  <button
                    className="border-4 rounded p-10 flex-grow text-2xl bg-secondary-300 text-foreground"
                    onClick={() => {
                      for (let team in props.game.teams) {
                        props.game.teams[team].mistakes = 0;
                      }
                      props.setGame((prv) => ({ ...prv }));
                      send({ action: "data", data: props.game });
                    }}
                  >
                    {t("Reset Mistakes")}
                  </button>
                </div>

                {/* GETS POINTS MISTAKE */}
                <div className="grid grid-rows-2 grid-flow-col gap-5">
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
                  <div className="flex flex-col space-y-2 px-10 pt-5">
                    {/* QUESTION */}
                    <p className="text-3xl font-bold text-foreground">
                      {current_round.question}
                    </p>
                    {/* POINT TRACKER */}
                    <div className="flex flex-row border-4 p-2 space-x-5 items-center justify-between">
                      <div className="flex flex-row space-x-5 items-center">
                        <h3 className="text-xl  text-foreground">
                          {t("Points")}:{" "}
                        </h3>
                        <h3 className="text-2xl flex-grow  text-foreground">
                          {t("number", { count: game.point_tracker[game.round] })}
                        </h3>
                      </div>
                      <div className="flex flex-row space-x-2 items-center">
                        <h3 className="text-xl text-foreground">
                          {t("multiplier")}:{" "}
                        </h3>
                        <h3 className="text-2xl text-foreground">x</h3>
                        <input
                          type="number"
                          min="1"
                          className="p-1 border-2 w-24 bg-secondary-200 text-foreground placeholder-secondary-900"
                          value={current_round.multiply}
                          placeholder={t("multiplier")}
                          onChange={(e) => {
                            let value = parseInt(e.target.value);
                            if (value === 0) {
                              value = 1;
                            }
                            current_round.multiply = value;
                            props.setGame((prv) => ({ ...prv }));
                            send({ action: "data", data: game });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* GAME BOARD BUTTONS */}
                  <div className=" text-white rounded border-4 grid grid-rows-4 grid-flow-col  p-3 mx-10 mt-5 gap-3 ">
                    {current_round.answers.map((x) => (
                      <div
                        className={`${
                          x.trig ? "bg-secondary-500" : "bg-primary-700"
                          } font-extrabold uppercase rounded border-2 text-2xl rounded `}
                      >
                        <button
                          className="flex flex-row p-5 justify-center min-h-full items-center min-w-full"
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
                              if (game.point_tracker[game.round] < 0) {
                                game.point_tracker[game.round] = 0;
                              }
                              props.setGame((prv) => ({ ...prv }));
                            }
                            send({ action: "data", data: game });
                          }}
                        >
                          <div className="flex-grow">{x.ans}</div>
                          <div className="p-2">
                            {t("number", { count: x.pnt })}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* BUZZERS AND PLAYERS */}
                  <div className="grid grid-cols-2 gap-4 p-5">
                    <h1 className="text-2xl capitalize text-foreground">
                      {t("Buzzer Order")}
                    </h1>
                    <h1 className="text-2xl capitalize text-foreground">
                      {t("players")}
                    </h1>
                    <div className="border-4 h-48 overflow-y-scroll rounded p-5 text-center">
                      <div className="flex flex-col  h-full space-y-2 justify-between">
                        <div className="">
                          {game.buzzed.length > 0 ? (
                            <div className="flex flex-row items-center space-x-5">
                              {/* active clear buzzers button */}
                              <button
                                className="border-4 bg-failure-200 hover:bg-failure-500 rounded p-2 text-foreground"
                                onClick={() => {
                                  send({ action: "clearbuzzers" });
                                }}
                              >
                                {t("Clear Buzzers")}
                              </button>
                              <p className="text-secondary-900">
                                {t("Changing rounds also clears buzzers")}
                              </p>
                            </div>
                          ) : (
                              <div className="flex flex-row items-center space-x-5">
                                {/* disabled clear buzzers button */}
                                <button className="border-4 bg-secondary-500 rounded p-2 text-foreground">
                                  {t("Clear Buzzers")}
                                </button>
                                <p className="text-secondary-900">
                                  {t("Changing rounds also clears buzzers")}
                                </p>
                              </div>
                            )}
                        </div>
                        <hr />
                        <div className="flex-grow">
                          {game.buzzed.map((x, i) => (
                            <div className="flex flex-row space-x-5 justify-center">
                              <p className="text-foreground">
                                {t("number", { count: i + 1 })}.{" "}
                                {game.registeredPlayers[x.id]?.name}
                              </p>
                              <p className="text-foreground">
                                {t("team")}:{" "}
                                {
                                  game.teams[game.registeredPlayers[x.id]?.team]
                                    ?.name
                                }
                              </p>
                              <p className="text-foreground">
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
                    <div className="p-5">
                      {/* FINAL ROUND TEXT */}
                      <h2 className="text-6xl py-5 text-center text-foreground">
                        {t("Final Round")}{" "}
                        {t("number", { count: game.is_final_second ? "2" : "1" })}
                      </h2>
                      <hr />
                      <div className="flex py-5 items-center flex-row justify-evenly space-x-5">
                        {/* START FINAL ROUND 2 */}
                        {!game.is_final_second ? (
                          <button
                            className={`border-4 rounded p-5 text-3xl bg-secondary-300 text-foreground ${timerStarted ? 'opacity-50': ''}`}
                            disabled={timerStarted}
                            onClick={() => {
                              console.debug(game);
                              game.is_final_second = true;
                              game.hide_first_round = true;
                              props.setGame((prv) => ({ ...prv }));
                              send({ action: "data", data: game });
                              send({
                                action: "set_timer",
                                data: game.final_round_timers[1],
                              });
                              setTimerCompleted(false);
                            }}
                          >
                            {t("start")} {t("Final Round")}{" "}
                            {t("number", { count: 2 })}
                          </button>
                        ) : (
                            <div className="flex py-5 items-center flex-row justify-evenly text-foreground space-x-5">
                              {/* GO BACK TO FINAL ROUND 1 */}
                              <button
                                className={`border-4 rounded p-5 text-3xl bg-secondary-300 ${timerStarted ? 'opacity-50': ''}`}
                                disabled={timerStarted}
                                onClick={() => {
                                  game.is_final_round = true;
                                  game.hide_first_round = false;
                                  game.is_final_second = false;
                                  props.setGame((prv) => ({ ...prv }));
                                  send({ action: "data", data: game });
                                  send({
                                    action: "set_timer",
                                    data: game.final_round_timers[0],
                                  });
                                }}
                              >
                                {t("Back To")} {t("Final Round")}{" "}
                                {t("number", { count: 1 })}
                              </button>
                              {game.is_final_second ? (
                                <div>
                                  {/* REVEAL FIRST ROUND ANSWERS */}
                                  {game.hide_first_round ? (
                                    <button
                                      className="border-4 rounded p-5 text-3xl bg-secondary-300 text-foreground"
                                      onClick={() => {
                                        game.hide_first_round = false;
                                        props.setGame((prv) => ({ ...prv }));
                                        send({ action: "data", data: game });
                                      }}
                                    >
                                      {t("Reveal First Round Answers")}
                                    </button>
                                  ) : (
                                      // HIDE FIRST ROUND ANSWERS
                                      <button
                                        className="border-4 rounded p-5 text-3xl bg-secondary-300 text-foreground"
                                        onClick={() => {
                                          game.hide_first_round = true;
                                          props.setGame((prv) => ({ ...prv }));
                                          send({ action: "data", data: game });
                                        }}
                                      >
                                        {t("Hide First Round Answers")}
                                      </button>
                                    )}
                                </div>
                              ) : null}
                            </div>
                          )}
                        <div className="px-2 flex">
                          {!timerStarted ? (
                            /* START TIMER */
                            <button
                              className={`border-4 rounded p-5 text-3xl bg-secondary-300 text-foreground ${timerCompleted ? 'opacity-50' : ''}`}
                              disabled={timerCompleted}
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
                                setTimerStarted(true);
                                setTimerCompleted(false);
                              }}
                            >
                              {t("Start Timer")}
                            </button>
                          ) : (
                              /* STOP TIMER */
                              <button
                                className="border-4 rounded p-5 text-3xl bg-secondary-300 text-foreground"
                                onClick={() => {
                                  send({ action: "stop_timer" });
                                  setTimerStarted(false);
                                }}
                              >
                                {t("Stop Timer")}
                              </button>
                            )}
                            <button className={`border-4 rounded p-5 ml-2 text-3xl bg-secondary-300 text-foreground ${!timerStarted ? '' : 'opacity-50'}`}
                            disabled={timerStarted} 
                            onClick={() => {
                                if(!timerStarted) {
                                  if (game.is_final_second) {
                                    send({
                                      action: "set_timer",
                                      data: game.final_round_timers[1],
                                    });
                                  } else {
                                    send({
                                      action: "set_timer",
                                      data: game.final_round_timers[0],
                                    });
                                  }
                                }
                                setTimerCompleted(false);
                              }}>
                              {t("Reset Timer")}
                            </button>
                        </div>
                      </div>
                      <FinalRoundPointTotals game={game} />
                      {/* FINAL ROUND QUESTIONS AND ANSWERS */}
                      <FinalRoundButtonControls
                        game={game}
                        setGame={props.setGame}
                        send={send}
                      />
                    </div>
                  </div>
                )}
            </div>
          )}
        {/* Modal over whole admin page */}
        {csvFileUpload ? (
          <CSVLoader
            csvFileUpload={csvFileUpload}
            setCsvFileUpload={setCsvFileUpload}
            csvFileUploadText={csvFileUploadText}
            send={send}
          />
        ) : null}
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
