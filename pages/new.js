import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import LanguageSwitcher from "../components/language";

export default function CreateGame(props) {
  const { t } = useTranslation();
  let gameTemplate = {
    rounds: [
      {
        question: "",
        answers: [{ ans: "", pnt: 0, trig: false }],
        multiply: "",
      },
    ],
    final_round: Array.from(Array(4), (x, index) => {
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

  console.debug(game);

  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  return (
    <div class="p-5">
      <div class="py-10 flex-col space-y-5">
        <div class="flex flex-row space-x-5">
          <p>{t("language")}:</p>
          <LanguageSwitcher />
        </div>
        <p class="text-3xl">{t("rounds")}</p>
        <div class="border-2 p-3 flex flex-col space-y-3">
          {game.rounds.map((r, index) => (
            <div class="border-2 p-3 flex flex-col space-y-3">
              <div class="flex space-x-3 flex-row">
                <input
                  class="p-2 border-2"
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
                  class="p-2 border-2"
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
              <div class="p-2 border-2">
                {r.answers.map((a, ain) => (
                  <div class="flex flex-row space-x-3 pb-2" key={ain}>
                    <input
                      class="p-2 border-2"
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
                      class="p-2 border-2"
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
                      class="hover:shadow-md text-xl px-3 bg-red-200"
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
              <div class="py-2 flex flex-row space-x-3">
                <button
                  onClick={() => {
                    r.answers.push({ ans: "", pnt: 0, trig: false });
                    setGame((prv) => ({ ...prv }));
                  }}
                  class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md"
                >
                  {t("Answer")} +
                </button>
                <button
                  onClick={() => {
                    game.rounds.splice(index, 1);
                    setGame((prv) => ({ ...prv }));
                  }}
                  class="hover:shadow-md rounded-md bg-red-200 px-3 py-1 text-md"
                >
                  {t("round")} -
                </button>
              </div>
            </div>
          ))}
          <div class="pt-5">
            <button
              onClick={() => {
                game.rounds.push({
                  question: "",
                  answers: [{ ans: "", pnt: 0, trig: false }],
                  multiply: "",
                });
                setGame((prv) => ({ ...prv }));
              }}
              class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md"
            >
              {t("round")} +
            </button>
          </div>
        </div>
      </div>

      <div class="py-10 flex-col space-y-5">
        <div class="flex flex-row space-x-10 items-end">
          <p class="text-3xl">Fast Money </p>
          <div>
            <p class="text-black text-opacity-50">
              {t("timer")} {t("number", { count: 1 })}
            </p>
            <input
              type="number"
              min="0"
              class="p-2 border-2"
              value={game.final_round_timers[0]}
              placeholder={`${t("timer")} ${t("number", { count: 1 })}`}
              onChange={(e) => {
                game.final_round_timers[0] = parseInt(e.target.value);
                setGame((prv) => ({ ...prv }));
              }}
            />
          </div>
          <div>
            <p class="text-black text-opacity-50">
              {t("timer")} {t("number", { count: 2 })}
            </p>
            <input
              type="number"
              min="0"
              class="p-2 border-2"
              value={game.final_round_timers[1]}
              placeholder={`${t("timer")} ${t("number", { count: 2 })}`}
              onChange={(e) => {
                game.final_round_timers[1] = parseInt(e.target.value);
                setGame((prv) => ({ ...prv }));
              }}
            />
          </div>
        </div>
        <div class="border-2 p-3">
          {game.final_round.map((q) => (
            <div class="flex flex-col space-y-2 pt-5">
              <input
                class="p-2 border-2"
                value={q.question}
                onChange={(e) => {
                  q.question = e.target.value;
                  setGame((prv) => ({ ...prv }));
                }}
              />
              <div class="border-2 p-3">
                {q.answers.map((a, ain) => (
                  <div class="flex flex-row space-x-3 pb-2" key={ain}>
                    <input
                      class="p-2 border-2"
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
                      class="p-2 border-2"
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
                      class="hover:shadow-md text-xl px-3 bg-red-200"
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
                  class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error !== "" ? (
        <div class="bg-red-500 p-2 rounded-md">
          <p class="text-white font-semibold uppercase">{t("error")}:</p>
          <p class="text-white">{error}</p>
        </div>
      ) : null}

      <div class="flex flex-row space-x-5 pt-5">
        <button
          class="hover:shadow-md rounded-md bg-green-200 p-2 px-10"
          onClick={() => {
            // ERROR checking
            let error = [];
            if (game.rounds.length == 0) {
              error.push(t("You need to create some rounds to save the game"));
            }
            game.rounds.forEach((r, index) => {
              if (r.question === "") {
                error.push(t("round number {{count, number}} has an empty question", { count: index + 1 }));
              }
              if (r.multiply === "" || r.multiply === 0 || isNaN(r.multiply)) {
                error.push(t("round number {{count, number}} has no point multipler", { count: index + 1 }));
              }
              if (r.answers.length === 0) {
                error.push(t("round number {{count, number}} has no answers", { count: index + 1 }));
              }
              r.answers.forEach((a, aindex) => {
                if (a.ans === "") {
                  error.push(
                    t("round item {{count, number}} has empty answer at answer number {{answernum, number}}", {
                      count: index + 1,
                      answernum: aindex + 1,
                    })
                  );
                }
                if (a.pnt === 0 || a.pnt === "" || isNaN(a.pnt)) {
                  error.push(
                    t("round item {{count, number}} has {{zero, number}} points answer number {{answernum, number}}", {
                      count: index + 1,
                      zero: 0,
                      answernum: aindex + 1,
                    })
                  );
                }
              });
            });

            console.log(error);
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
        <div class="flex flex-col border-2  rounded-lg">
          <div class="p-2 ml-4 items-center transform translate-y-3">
            <input type="file" class="" id="gamePicker" accept=".json" />
            <button
              class="hover:shadow-md rounded-md p-2 bg-blue-200"
              onClick={() => {
                var file = document.getElementById("gamePicker").files[0];
                if (file) {
                  var reader = new FileReader();
                  reader.readAsText(file, "utf-8");
                  reader.onload = function (evt) {
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
                    setGame(data);
                  };
                  reader.onerror = function (evt) {
                    console.error("error reading file");
                  };
                }
              }}
            >
              {t("submit")}
            </button>
          </div>
          <div class="flex flex-row">
            <span class="translate-x-3 px-2 text-black text-opacity-50 flex-shrink inline translate-y-3 transform bg-white ">
              {t("Load Game")}
            </span>
            <div class="flex-grow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
