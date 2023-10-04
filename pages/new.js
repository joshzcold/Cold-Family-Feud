import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import LanguageSwitcher from "../components/language";
import { ThemeSwitcher } from "../components/Admin/settings";

export default function CreateGame(props) {
  const { t } = useTranslation();
  let gameTemplate = {
    settings: {},
    rounds: [
      {
        question: "",
        answers: [{ ans: "", pnt: 0, trig: false }],
        multiply: "",
      },
    ],
    final_round: Array.from(Array(5), (x, index) => {
      return {
        question: `${t("question")} ${t("number", { count: index + 1 })}`,
        answers: [],
        selection: 0,
        points: 0,
        input: "",
        revealed: false,
      };
    }),
    final_round_timers: [20, 25],
  };
  const [error, setError] = useState("");
  const [game, setGame] = useState(gameTemplate);
  const [theme, setTheme] = useState({
    settings: {}
  });

  console.debug(game);

  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  if (typeof window !== "undefined") {
    document.body.className= game?.settings?.theme + " bg-background";
    // Prevent losing changes
    window.onbeforeunload = function() {
      return "";
    };
  }
  return (
    <div className={`${theme?.settings?.theme} bg-background min-h-screen`}>
      <div className="p-5">
        <div className="py-10 flex-col space-y-5">
          <div className="flex flex-row space-x-5 items-center">
            <p className="text-foreground">{t("language")}:</p>
            <LanguageSwitcher />
            <ThemeSwitcher
              game={theme}
              setGame={setTheme}
              send={() => {
                console.debug("send from new");
              }}
            />
            <div className="flex flex-col border-2  rounded-lg">
              <div className="p-2 ml-4 items-center transform translate-y-3">
                <input
                  type="file"
                  className=" bg-secondary-300 text-foreground"
                  id="gamePicker"
                  accept=".json"
                />
                <button
                  className="hover:shadow-md rounded-md p-2 bg-primary-200"
                  onClick={() => {
                    var file = document.getElementById("gamePicker").files[0];
                    if (file) {
                      var reader = new FileReader();
                      reader.readAsText(file, "utf-8");
                      reader.onload = function(evt) {
                        let data = JSON.parse(evt.target.result);
                        console.debug(data);

                        data.final_round == null
                          ? (data.final_round = gameTemplate.final_round)
                          : null;
                        data.rounds == null
                          ? (data.rounds = gameTemplate.rounds)
                          : null;
                        data.final_round_timers == null
                          ? (data.final_round_timers =
                            gameTemplate.final_round_timers)
                          : null;
                        data.settings == null
                          ? (data.settings = gameTemplate.settings)
                          : null;
                        setGame(data);
                      };
                      reader.onerror = function(evt) {
                        console.error("error reading file");
                      };
                    }
                  }}
                >
                  {t("submit")}
                </button>
              </div>
              <div className="flex flex-row">
                <span className="translate-x-3 px-2 text-foreground flex-shrink inline translate-y-3 transform bg-background ">
                  {t("Load Game")}
                </span>
                <div className="flex-grow"></div>
              </div>
            </div>
          </div>
          <p className="text-3xl text-foreground">{t("rounds")}</p>
          <div className="border-2 p-3 flex flex-col space-y-3">
            {game.rounds.map((r, index) => (
              <div className="border-2 p-3 flex flex-col space-y-3">
                <div className="flex space-x-3 flex-row">
                  <input
                    className="p-2 border-2 bg-secondary-300 text-foreground"
                    value={r.question}
                    placeholder={t("question")}
                    onChange={(e) => {
                      r.question = e.target.value;
                      setGame((prv) => ({ ...prv }));
                    }}
                  />
                  <input
                    type="number"
                    min="1"
                    className="p-2 border-2 bg-secondary-300 text-foreground"
                    value={r.multiply}
                    placeholder={t("multiplier")}
                    onChange={(e) => {
                      let value = parseInt(e.target.value);
                      if (value === 0) {
                        value = 1;
                      }
                      r.multiply = value;
                      setGame((prv) => ({ ...prv }));
                    }}
                  />
                </div>
                <div className="p-2 border-2">
                  {r.answers.map((a, ain) => (
                    <div className="flex flex-row space-x-3 pb-2" key={ain}>
                      <input
                        className="p-2 border-2 bg-secondary-300 text-foreground"
                        value={a.ans}
                        placeholder={t("Answer")}
                        onChange={(e) => {
                          a.ans = e.target.value;
                          setGame((prv) => ({ ...prv }));
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        className="p-2 border-2 bg-secondary-300 text-foreground"
                        value={a.pnt}
                        placeholder={t("points")}
                        onChange={(e) => {
                          a.pnt = parseInt(e.target.value);
                          setGame((prv) => ({ ...prv }));
                        }}
                      />
                      <button
                        onClick={() => {
                          r.answers.splice(ain, 1);
                          setGame((prv) => ({ ...prv }));
                        }}
                        className="hover:shadow-md text-xl px-3 bg-failure-200"
                      >
                        -
                      </button>
                    </div>
                  ))}
                </div>
                <div className="py-2 flex flex-row space-x-3">
                  <button
                    onClick={() => {
                      r.answers.push({ ans: "", pnt: 0, trig: false });
                      setGame((prv) => ({ ...prv }));
                    }}
                    className="hover:shadow-md rounded-md bg-success-200 px-3 py-1 text-md"
                  >
                    {t("Answer")} +
                  </button>
                  <button
                    onClick={() => {
                      game.rounds.splice(index, 1);
                      setGame((prv) => ({ ...prv }));
                    }}
                    className="hover:shadow-md rounded-md bg-failure-200 px-3 py-1 text-md"
                  >
                    {t("round")} -
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-5">
              <button
                onClick={() => {
                  game.rounds.push({
                    question: "",
                    answers: [{ ans: "", pnt: 0, trig: false }],
                    multiply: "",
                  });
                  setGame((prv) => ({ ...prv }));
                }}
                className="hover:shadow-md rounded-md bg-success-200 px-3 py-1 text-md"
              >
                {t("round")} +
              </button>
            </div>
          </div>
        </div>

        <div className="py-10 flex-col space-y-5">
          <div className="flex flex-row space-x-10 items-end">
            <p className="text-3xl text-foreground">{t("Fast Money")}</p>
            <div>
              <p className="text-secondary-900">
                {t("timer")} {t("number", { count: 1 })}
              </p>
              <input
                type="number"
                min="0"
                className="p-2 border-2 bg-secondary-300 text-foreground"
                value={game.final_round_timers[0]}
                placeholder={`${t("timer")} ${t("number", { count: 1 })}`}
                onChange={(e) => {
                  game.final_round_timers[0] = parseInt(e.target.value);
                  setGame((prv) => ({ ...prv }));
                }}
              />
            </div>
            <div>
              <p className="text-secondary-900">
                {t("timer")} {t("number", { count: 2 })}
              </p>
              <input
                type="number"
                min="0"
                className="p-2 border-2 bg-secondary-300 text-foreground"
                value={game.final_round_timers[1]}
                placeholder={`${t("timer")} ${t("number", { count: 2 })}`}
                onChange={(e) => {
                  game.final_round_timers[1] = parseInt(e.target.value);
                  setGame((prv) => ({ ...prv }));
                }}
              />
            </div>
          </div>
          <div className="border-2 p-3">
            {game.final_round.map((q, qin) => (
              <div className="flex flex-col space-y-2 pt-5">
                <input
                  className="p-2 border-2 bg-secondary-300 text-foreground"
                  value={q.question}
                  onChange={(e) => {
                    q.question = e.target.value;
                    setGame((prv) => ({ ...prv }));
                  }}
                />
                <div className="border-2 p-3">
                  {q.answers.map((a, ain) => (
                    <div className="flex flex-row space-x-3 pb-2" key={ain}>
                      <input
                        className="p-2 border-2 bg-secondary-300 text-foreground"
                        value={a[0]}
                        placeholder={t("Answer")}
                        onChange={(e) => {
                          a[0] = e.target.value;
                          setGame((prv) => ({ ...prv }));
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        className="p-2 border-2 bg-secondary-300 text-foreground"
                        value={a[1]}
                        placeholder={t("points")}
                        onChange={(e) => {
                          a[1] = parseInt(e.target.value);
                          setGame((prv) => ({ ...prv }));
                        }}
                      />
                      <button
                        onClick={() => {
                          q.answers.splice(ain, 1);
                          setGame((prv) => ({ ...prv }));
                        }}
                        className="hover:shadow-md text-xl px-3 bg-failure-200"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      q.answers.push(["", ""]);
                      setGame((prv) => ({ ...prv }));
                    }}
                    className="hover:shadow-md rounded-md bg-success-200 px-3 py-1 text-md"
                  >
                    {t("Answer")} +
                  </button>
                  <div className="pt-5">
                    <button
                      onClick={() => {
                        game.final_round.splice(qin, 1);
                        setGame((prv) => ({ ...prv }));
                      }}
                      className="hover:shadow-md rounded-md bg-failure-200 px-3 py-1 text-md"
                    >
                      {t("Question")} -
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-5">
              <button
                onClick={() => {
                  game.final_round.push({
                    question: `${t("question")} ${t("number", {
                      count: game.final_round.length + 1,
                    })}`,
                    answers: [],
                    selection: 0,
                    points: 0,
                    input: "",
                    revealed: false,
                  });
                  setGame((prv) => ({ ...prv }));
                }}
                className="hover:shadow-md rounded-md bg-success-200 px-3 py-1 text-md"
              >
                {t("Question")} +
              </button>
            </div>
          </div>
        </div>

        {error !== "" ? (
          <div className="bg-failure-500 p-2 rounded-md">
            <p className="text-white font-semibold uppercase">{t("error")}:</p>
            <p className="text-white">{error}</p>
          </div>
        ) : null}

        <div className="flex flex-row space-x-5 pt-5">
          <button
            className="hover:shadow-md rounded-md bg-success-200 p-2 px-10"
            onClick={() => {
              // ERROR checking
              let error = [];
              if (game.rounds.length == 0) {
                error.push(
                  t("You need to create some rounds to save the game")
                );
              }
              game.rounds.forEach((r, index) => {
                if (r.question === "") {
                  error.push(
                    t("round number {{count, number}} has an empty question", {
                      count: index + 1,
                    })
                  );
                }
                if (
                  r.multiply === "" ||
                  r.multiply === 0 ||
                  isNaN(r.multiply)
                ) {
                  error.push(
                    t("round number {{count, number}} has no point multipler", {
                      count: index + 1,
                    })
                  );
                }
                if (r.answers.length === 0) {
                  error.push(
                    t("round number {{count, number}} has no answers", {
                      count: index + 1,
                    })
                  );
                }
                r.answers.forEach((a, aindex) => {
                  if (a.ans === "") {
                    error.push(
                      t(
                        "round item {{count, number}} has empty answer at answer number {{answernum, number}}",
                        {
                          count: index + 1,
                          answernum: aindex + 1,
                        }
                      )
                    );
                  }
                  if (a.pnt === 0 || a.pnt === "" || isNaN(a.pnt)) {
                    error.push(
                      t(
                        "round item {{count, number}} has {{zero, number}} points answer number {{answernum, number}}",
                        {
                          count: index + 1,
                          zero: 0,
                          answernum: aindex + 1,
                        }
                      )
                    );
                  }
                });
              });

              console.error(error);
              if (error.length === 0) {
                setError("");
                downloadToFile(
                  JSON.stringify(game),
                  `${t("new-cold-feud")}.json`,
                  "text/json"
                );
              } else {
                setError(error.join(", "));
              }
            }}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
