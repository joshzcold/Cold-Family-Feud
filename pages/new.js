import { useState, useEffect} from 'react';
import "tailwindcss/tailwind.css";

export default function CreateGame(props){
  const [error, setError] = useState("")
  const [game, setGame] = useState({
    rounds:[
      {
        "question": "",
        "answers": [
          {ans:"",pnt:0,trig:false}
        ],
        "multiply": ""
      },
    ],
    final_round: Array.from(Array(4), (x, index) => {
      return {question: `question ${index +1}`,
        answers: [],
        "selection": 0,
        "points": "",
        "input": "",
        "revealed": false
      }
    }),
    final_round_timers: [20, 25]
  })

  console.debug(game)

  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  return (
    <div class="p-5">
      <div class="py-10 flex-col space-y-5">
        <p class="text-3xl" >Rounds</p>
        <div class="border-2 p-3 flex flex-col space-y-3">
          {game.rounds.map((r, index) => 
          <div class="border-2 p-3 flex flex-col space-y-3">
            <div class="flex space-x-3 flex-row">
              <input class="p-2 border-2" value={r.question} placeholder="question"
                onChange={e => {
                  r.question = e.target.value
                  setGame(prv => ({ ...prv }));
                }}
              />
              <input type="number" class="p-2 border-2" value={r.multiply} placeholder="multiplier"
                onChange={e => {
                  let value = parseInt(e.target.value)
                  if(value === 0 ){
                    value = 1
                  }
                  r.multiply = value
                  setGame(prv => ({ ...prv }));
                }}
              />
            </div>
            <div class="p-2 border-2">
              {r.answers.map((a, ain) => 
              <div class="flex flex-row space-x-3 pb-2" key={ain}>
                <input class="p-2 border-2" value={a.ans} placeholder="answer"
                  onChange={e => {
                    a.ans = e.target.value
                    setGame(prv => ({ ...prv }));
                  }}
                />
                <input type="number" class="p-2 border-2" value={a.pnt} placeholder="points"
                  onChange={e => {
                    a.pnt = parseInt(e.target.value)
                    setGame(prv => ({ ...prv }));
                  }}
                />
                <button onClick={() => {
                  r.answers.splice(ain, 1)
                  setGame(prv => ({ ...prv }));
                }} class="hover:shadow-md text-xl px-3 bg-red-200">
                  -
                </button >
              </div>
              )}
            </div>
            <div class="py-2 flex flex-row space-x-3">
              <button onClick={() => {
                r.answers.push( {ans:"", pnt:0, trig: false} )
                setGame(prv => ({ ...prv }));
              }} class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md">
                Answer +
              </button >
              <button onClick={() => {
                game.rounds.splice(index,1)
                setGame(prv => ({ ...prv }));
              }} class="hover:shadow-md rounded-md bg-red-200 px-3 py-1 text-md">
                Round -
              </button >
            </div>
          </div>
          )}
          <div class="pt-5">
            <button onClick={() => {
              game.rounds.push({
                "question": "",
                "answers": [ {ans:"", pnt:0, trig: false} ],
                "multiply": ""
              })
              setGame(prv => ({ ...prv }));
            }} class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md">
              Round +
            </button >
          </div>
        </div>
      </div>

      <div class="py-10 flex-col space-y-5">
        <div class="flex flex-row space-x-10 items-end">
          <p class="text-3xl" >Fast Money </p>
          <div>
          <p class="text-black text-opacity-50" >timer 1</p>
          <input type="number" class="p-2 border-2" value={game.final_round_timers[0]} placeholder="timer 1"
            onChange={e => {
              game.final_round_timers[0] = parseInt(e.target.value)
              setGame(prv => ({ ...prv }));
            }}
          />
          </div>
          <div>
          <p class="text-black text-opacity-50" >timer 2</p>
          <input type="number" class="p-2 border-2" value={game.final_round_timers[1]} placeholder="timer 2"
            onChange={e => {
              game.final_round_timers[1] = parseInt(e.target.value)
              setGame(prv => ({ ...prv }));
            }}
          />
          </div>
        </div>
        <div class="border-2 p-3">
          {game.final_round.map(q => 
          <div class="flex flex-col space-y-2 pt-5">
            <input class="p-2 border-2" value={q.question}
              onChange={e => {
                q.question = e.target.value
                setGame(prv => ({ ...prv }));
              }}
            />
            <div class="border-2 p-3">
              {q.answers.map((a, ain) => 
              <div class="flex flex-row space-x-3 pb-2" key={ain}>
                <input class="p-2 border-2" value={a[0]} placeholder="answer"
                  onChange={e => {
                    a[0] = e.target.value
                    setGame(prv => ({ ...prv }));
                  }}
                />
                <input type="number" class="p-2 border-2" value={a[1]} placeholder="points"
                  onChange={e => {
                    a[1] = parseInt(e.target.value)
                    setGame(prv => ({ ...prv }));
                  }}
                />
                <button onClick={() => {
                  q.answers.splice(ain, 1)
                  setGame(prv => ({ ...prv }));
                }} class="hover:shadow-md text-xl px-3 bg-red-200">
                  -
                </button >
              </div>

              )} 
              <button onClick={() => {
                q.answers.push(["", ""])
                setGame(prv => ({ ...prv }));
              }} class="hover:shadow-md rounded-md bg-green-200 px-3 py-1 text-md">
                +
              </button >
            </div>
          </div>
          )}
        </div>
      </div>

      {error !== ""?
        <div class="bg-red-500 p-2 rounded-md">
          <p class="text-white font-semibold">ERROR:</p>
          <p class="text-white">{error}</p>
        </div>
        :null
      }

      <div class="flex flex-row space-x-5 pt-5">
        <button class="hover:shadow-md rounded-md bg-green-200 p-2 px-10"
          onClick={() => {
            // ERROR checking
            let error = []
            if(game.rounds.length == 0 ){
              error.push("You need to create some rounds to save the game")
            } 
            game.rounds.forEach((r, index) => {
              if(r.question === ""){
               error.push(`round number ${index + 1} has an empty question` )
              }
              if(r.multiply === "" || r.multiply === 0 || isNaN(r.multiply)){
               error.push(`round number ${index + 1} has no point multipler` )
              }
              if(r.answers.length === 0){
               error.push(`round number ${index + 1} has no answers` )
              }
              r.answers.forEach((a,aindex) => {
                if(a.ans === ""){
                  error.push(`round item ${index + 1} has empty answer at answer number ${aindex + 1}` )
                }
                if(a.pnt === 0 || a.pnt === "" || isNaN(a.pnt)){

                  error.push(`round item ${index + 1} has 0 points answer number ${aindex + 1}` )
                }

              })
            })

            game.final_round.forEach((a, index) => {
              if(a.question === ""){
               error.push(`final round item ${index + 1} has empty question` )
              }

              if(a.answers.length === 0){
               error.push(`final round item ${index + 1} has no answers` )
              }
              a.answers.forEach((ans, aindex) => {
                if(ans[0] === ""){
                  error.push(`final round item ${index + 1} has empty answer at answer number ${aindex + 1}` )
                }
                if(ans[1] === "" || ans[1] === 0 || isNaN(ans[1]) ){

                  error.push(`final round item ${index + 1} has 0 points answer number ${aindex + 1}` )
                }
              })
            })
           
            console.log(error)
            if(error.length === 0){
              setError("")
              downloadToFile(JSON.stringify(game),
                'new-cold-feud.json', 'text/json') 
            }else{
              setError(error.join(", "))
            }
          }}>
          Save
        </button>
        <div class="flex flex-col border-2  rounded-lg">
          <div class="p-2 ml-4 items-center transform translate-y-3">
            <input type="file" class="" id="gamePicker" accept=".json"/>
            <button class="hover:shadow-md rounded-md p-2 bg-blue-200" onClick={() => {
              var file = document.getElementById("gamePicker").files[0];
              if (file) {
                var reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = function (evt) {
                  let data = JSON.parse(evt.target.result)
                  console.debug(data)
                  setGame(data)
                }
                reader.onerror = function (evt) {
                  console.error("error reading file")
                }
              }
            }}>Submit</button>
          </div>
          <div class="flex flex-row">
            <span class="translate-x-3 px-2 text-black text-opacity-50 flex-shrink inline translate-y-3 transform bg-white ">Load Game</span>
            <div class="flex-grow"></div>
          </div>
        </div>
      </div>

    </div>
  )
}
