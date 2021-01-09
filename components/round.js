import "tailwindcss/tailwind.css";

export default function Round(props){
  let current_round = props.game.round
  let round = props.game.rounds[current_round]
  return (
    <div class="">
      <div class="text-center">
        <div style={{borderWidth: 12}} class="border-black px-12 inline-block bg-gradient-to-tr
          my-10 from-blue-900 to-blue-500">
          <p class="text-white"style={{textShadow: "1px 2px 4px black", fontSize: 72, fontWeight: 600}}>{props.game.point_tracker}</p>
        </div>
        <div class="my-5 flex flex-row justify-center">
          <p class="text-end text-3xl ">{round.question}</p>
          {round.multiply > 1?
            <div style={{transform: "translate(0px, -7px)"}}>
              <p class="text-2xl text-start">x{round.multiply}</p>
            </div>:null
          }
        </div>
        <div class="flex flex-row items-center">
          <div style={{borderWidth: 12}} class="border-black bg-gradient-to-tr px-12 ml-5
            from-blue-900 to-blue-500 flex items-center justify-center">
            <p class="text-white" style={{fontSize: 52, textShadow: "1px 2px 4px black"}}>{props.game.teams[0].points}</p>
          </div>

          <div class="rounded-3xl border-black grid grid-rows-4 grid-flow-col  p-3 mx-10 mb-10 gap-3 bg-black flex-grow"
            style={{borderWidth: 12}}>
            {round.answers.map((x, index) =>
            <div class=" uppercase items-center text-center rounded border-2 font-extrabold">

              {x.trig?
                  // answered question
                  <div class="h-full bg-gradient-to-t from-blue-800 via-blue-600 to-blue-800">
                    <div class="flex h-full items-center justify-center">
                      <p class="text-4xl text-white px-5 flex-grow" style={{textShadow: "1px 2px 4px black"}}>{x.ans}</p>
                      <div class="bg-gradient-to-t from-blue-700 to-blue-400 border-l-2 h-full text-center items-center justify-center p-5 flex">
                        <p class="text-4xl text-white"style={{textShadow: "1px 2px 4px black"}}>{x.pnt}</p>
                      </div>
                    </div>
                  </div>
                  :
                  // unanswered question
                  <div class="h-full bg-gradient-to-t py-3 flex justify-center items-center from-blue-700 to-blue-400 ">
                    <div class="rounded-full justify-center items-center inline-block px-5 border-2 py-2 bg-gradient-to-tr
                      from-blue-900 to-blue-700" style={{boxShadow: "3px 3px 2px black"}}>
                      <p class="self-center text-5xl text-white font-black"style={{textShadow: "1px 2px 4px black"}}>{index +1}</p>
                    </div>
                  </div>
              }
            </div>
            )}
          </div>
          <div style={{borderWidth: 12}} class="border-black bg-gradient-to-tr px-12 mr-5
            from-blue-900 to-blue-500 flex items-center justify-center">
            <p class="text-white" style={{fontSize: 52,textShadow: "1px 2px 4px black"}}>{props.game.teams[1].points}</p>
          </div>
        </div>
      </div>
      <div class="text-3xl flex flex-row text-center justify-around ">
        <div class="flex flex-row items-center space-x-5">
          <div class="bg-gradient-to-tr from-blue-900 to-blue-500">
            <p class="p-5 uppercase text-white"
            style={{fontSize: 48, fontWeight:600,textShadow: "1px 2px 4px black"}}>{props.game.teams[0].name}</p>
          </div>
          <div class="flex justify-center flex-row text-center space-x-5">
            {Array(props.game.teams[0].mistakes).fill(
              <img class="w-24" src="x.svg"/>
            )}
          </div>

        </div>
        <div class="flex flex-row items-center space-x-5">
          <div class="flex justify-center flex-row text-center space-x-5">
            {Array(props.game.teams[1].mistakes).fill(
              <img class="w-24" src="x.svg"/>
            )}
          </div>
          <div class="bg-gradient-to-tr from-blue-900 to-blue-500">
            <p class="p-5 uppercase text-white"
            style={{fontSize: 48, fontWeight:600,textShadow: "1px 2px 4px black"}}>{props.game.teams[1].name}</p>
          </div>

        </div>
      </div>
    </div>
  )
}
