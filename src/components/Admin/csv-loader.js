import { useTranslation } from "react-i18next";
import "i18n/i18n";
import "tailwindcss/tailwind.css";
import { useState, useEffect, useRef } from "react";
import { ERROR_CODES } from "i18n/errorCodes";

export function csvStringToArray(data) {
  const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi;
  const result = [[]];
  let matches;
  while ((matches = re.exec(data))) {
    if (matches[1].length && matches[1] !== ",") result.push([]);
    result[result.length - 1].push(
      matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
    );
  }
  // remove last empty array element
  result.pop();
  return result;
}

/**
 * Verify the format <Question (string), Answer (string), Points (number), ...>
 * Verify the number of rounds doesn't exceed the amount of data
 */
function validateCsv(
  csvData,
  roundCount,
  roundFinalCount,
  noHeader,
  setError,
  t
) {
  let headerOffSet = noHeader ? 0 : 1;
  // the setting of rows is greater than the data provided
  if (roundCount + roundFinalCount + headerOffSet > csvData.length) {
    setError(
      t("Error: round and final round is greater than document has available.")
    );
    return;
  }

  for (let r in csvData) {
    let index = parseInt(r) + parseInt(headerOffSet);
    if (
      roundCount + roundFinalCount + headerOffSet < r ||
      csvData[index] === undefined
    ) {
      break;
    }
    let answer = true;
    colLoop: for (let i = 0; i < csvData[index].length; i++) {
      // Question doesn't need a format
      if (i === 0) {
        continue colLoop;
      }
      // Answer doesn't need a format
      if (answer) {
        answer = !answer;
        continue colLoop;
      } else {
        // Answer point needs to be a number
        if (csvData[index][i] && !/^\d+$/.test(csvData[index][i])) {
          setError(
            t(ERROR_CODES.CSV_INVALID_FORMAT)
          );
          return;
        }
        answer = !answer;
      }
    }
  }
}

function csvToColdFriendlyFeudFormat(
  csvData,
  roundCount,
  roundFinalCount,
  noHeader,
  timer,
  timer2nd,
  setError,
  send
) {
  let headerOffSet = noHeader ? 0 : 1;
  let gameTemplate = {
    settings: {},
    rounds: [
    ],
    final_round: [],
    final_round_timers: [timer, timer2nd],
  };

  for (let row = 0; row < csvData.length; row++) {
    let rowPush = {
      answers: [],
      multiply: 1,
    };
    let finalRowPush = {
      answers: [],
    };
    let answer = true;
    let answerCount = 0;
    let index = parseInt(row) + parseInt(headerOffSet)
    console.log(row, (roundCount+ roundFinalCount+ headerOffSet))
    if (index  < roundCount + headerOffSet) {
      colLoop: for (let col = 0 ; col < csvData[index].length; col++) {
        if (col === 0) {
          rowPush.question = csvData[index][col];
          continue colLoop;
        }
        if (answer) {
          rowPush.answers.push({
            ans: csvData[index][col],
          });
          answer = !answer;
        } else {
          rowPush.answers[answerCount].pnt = parseInt(
            csvData[index][col]
          );
          answerCount++;
          answer = !answer;
        }
      }
      gameTemplate.rounds.push(rowPush);
    } else if (index < roundCount + roundFinalCount + headerOffSet) {
      colLoop: for (let col = 0 ; col < csvData[index].length; col++) {
        if (col === 0) {
          finalRowPush.question = csvData[index][col];
          continue colLoop;
        }
        if (answer) {
          finalRowPush.answers.push([csvData[index][col]]);
          answer = !answer;
        } else {
          finalRowPush.answers[answerCount][1] = parseInt(
            csvData[index][col]
          );
          answerCount++;
          answer = !answer;
        }
      }
      gameTemplate.final_round.push(finalRowPush);
    }
  }
  send({ action: "load_game", data: gameTemplate });
}

export default function CSVLoader(props) {
  const { i18n, t } = useTranslation();
  let csvData = csvStringToArray(props.csvFileUploadText);
  const [roundCount, setRoundCount] = useState(6);
  const [roundFinalCount, setRoundFinalCount] = useState(4);
  const [noHeader, setNoHeader] = useState(false);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(20);
  const [timer2nd, setTimer2nd] = useState(25);
  useEffect(() => {
    setError(null);
    validateCsv(csvData, roundCount, roundFinalCount, noHeader, setError, t);
  });
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-background flex flex-col space-y-5">
        <div className="flex flex-row space-x-2 items-center">
          <div className="w-4">
            <svg
              className="fill-current text-secondary-900"
              viewBox="0 0 384 512"
            >
              <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
            </svg>
          </div>
          <p className="text-foreground">{t("CSV file upload")}: </p>
          <div className="p-2 rounded bg-secondary-500">
            <p>{props.csvFileUpload.name}</p>
          </div>
          <hr />
        </div>
        {error ? (
          <div id="csvErrorText" className="p-4 bg-failure-200 rounded space-y-2">
            <p className="font-bold">{error}</p>
            <div className="text-sm space-y-1">
              <p>{t("Expected format")}:</p>
              <p>• {t("Format Example")}</p>
              <p>• {t("Points must be numbers")}</p>
              <p>• {t("Example row")}: What is popular?, Pizza, 30, Burger, 25, Fries, 20</p>
            </div>
          </div>
        ) : null}
        <div className="bg-secondary-300 p-4 rounded space-y-2">
          <p className="font-semibold">{t("Format Guide")}:</p>
          <div className="text-sm space-y-1">
            <div className="grid grid-cols-7 gap-2">
              <div className="bg-secondary-500 p-2 rounded">{t("Question")}</div>
              <div className="bg-success-200 p-2 rounded">{t("Answer")} 1</div>
              <div className="bg-primary-200 p-2 rounded">{t("points")} 1</div>
              <div className="bg-success-200 p-2 rounded">{t("Answer")} 2</div>
              <div className="bg-primary-200 p-2 rounded">{t("points")} 2</div>
              <div className="bg-success-200 p-2 rounded">...</div>
              <div className="bg-primary-200 p-2 rounded">...</div>
            </div>
            <p className="text-xs mt-2">{t("Each row follows this pattern. Points must be numbers.")}</p>
          </div>
        </div>
        <div className="p-2 flex flex-col bg-secondary-500 overflow-x-scroll h-96 ">
          {csvData.map((row, roundCounter) => {
            return (
              <div key={`csvloader-round-${roundCounter}`} id={`csvRow${roundCounter}`} className="grid grid-flow-col divide-dashed divide-x divide-secondary-900">
                {row.map((col, colidx) => {
                  let rowBackgroundColor = "bg-secondary-500";
                  let rowTextColor = "text-foreground";
                  let roundOffSet = 0;
                  if (noHeader) {
                    roundOffSet = -1;
                  }
                  if (roundCounter === 0 && !noHeader) {
                    rowTextColor = "text-secondary-900";
                  } else if (roundCounter - 1 < roundCount + roundOffSet) {
                    rowBackgroundColor = "bg-success-200";
                  } else if (
                    roundCounter - 1 <
                    roundCount + roundFinalCount + roundOffSet
                  ) {
                    rowBackgroundColor = "bg-primary-200";
                  } else {
                    rowTextColor = "text-secondary-900";
                  }
                  if (col.length !== 0) {
                    return (
                      <div
                        id={`csvRow${roundCounter}Col${colidx}`}
                        key={`csvloader-round-${roundCounter}-${colidx}`}
                        className={`w-96 font-bold p-4 ${rowBackgroundColor} ${rowTextColor} border-y border-dashed border-secondary-900 `}
                      >
                        <p className="text-ellipsis whitespace-nowrap overflow-hidden">
                          {col}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
        <div className="grid lg:grid-cols-3 gap-5 md:grid-cols-1 sm:grid-cols-1">
          <div className="flex flex-row space-x-5 items-center">
            <div>
              <p className="text-xl normal-case text-foreground">
                {t("No Header")}:
              </p>
            </div>
            <input
              id="csvSetNoHeaderInput"
              className="w-4 h-4 rounded bg-secondary-900 text-foreground"
              checked={noHeader}
              onChange={(e) => {
                setNoHeader(e.target.checked);
              }}
              type="checkbox"
            ></input>
          </div>
          <div className="flex flex-row space-x-5 items-center">
            <div>
              <p className="text-xl normal-case text-foreground">{t("Rounds")}:</p>
            </div>
            <input
              id="csvSetRoundCountInput"
              className="p-2 w-24 rounded bg-secondary-300 text-foreground"
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (value === 0) {
                  value = 1;
                }
                setRoundCount(value);
              }}
              type="number"
              value={roundCount}
              min="1"
            ></input>
          </div>
          <div className="flex flex-row space-x-5 items-center">
            <div>
              <p className="text-xl normal-case text-foreground">
                {t("Final Rounds")}:
              </p>
            </div>
            <input
              id="csvSetFinalRoundCountInput"
              className="p-2 w-24 rounded bg-secondary-300 text-foreground"
              onChange={(e) => {
                let value = parseInt(e.target.value);
                setRoundFinalCount(value);
              }}
              value={roundFinalCount}
              type="number"
              min="0"
            ></input>
          </div>
          <div className="flex flex-row space-x-5 items-center">
            <div>
              <p className="text-xl normal-case text-foreground">
                {t("Final Round Timer")}:
              </p>
            </div>
            <input
              id="csvFinalRoundTimerInput"
              className="p-2 w-24 rounded bg-secondary-300 text-foreground"
              onChange={(e) => {
                let value = parseInt(e.target.value);
                setTimer(value);
              }}
              value={timer}
              type="number"
              min="0"
            ></input>
          </div>
          <div className="flex flex-row space-x-5 items-center">
            <div>
              <p className="text-xl normal-case text-foreground">
                {t("2nd Final Round Timer")}:
              </p>
            </div>
            <input
              id="csvFinalRound2ndTimerInput"
              className="p-2 w-24 rounded bg-secondary-300 text-foreground"
              onChange={(e) => {
                let value = parseInt(e.target.value);
                setTimer2nd(value);
              }}
              value={timer2nd}
              type="number"
              min="0"
            ></input>
          </div>
        </div>
        <div className="flex flex-row space-x-5">
          <button id="csvCancelUploadButton" className="text-2xl">
            <div
              className="w-48 hover:bg-secondary-200 rounded bg-secondary-500 p-2 flex justify-center"
              onClick={() => {
                setError(null);
                props.setCsvFileUpload(null);
              }}
            >
              {t("Cancel")}
            </div>
          </button>
          {!error ? (
            <button
              className="text-2xl"
              id="csvFileUploadSubmitButton"
              onClick={() => {
                csvToColdFriendlyFeudFormat(
                  csvData,
                  roundCount,
                  roundFinalCount,
                  noHeader,
                  timer,
                  timer2nd,
                  setError,
                  props.send
                );
                props.setCsvFileUpload(null);
              }}
            >
              <div className="w-48 hover:shadow-md rounded bg-success-200 p-2 flex justify-center">
                {t("Submit")}
              </div>
            </button>
          ) : (
              <button id="csvFileUploadSubmitButtonDisabled" className="text-2xl cursor-default">
                <div className="w-48 rounded bg-secondary-500 text-secondary-900 p-2 flex justify-center">
                  {t("Submit")}
                </div>
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
