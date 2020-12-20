import "tailwindcss/tailwind.css";

export default function Round(props){
  let current_round = props.game.round
  let round = props.game.rounds[current_round]
  return (
    <div >
      <div class="text-center mt-5">
        <p class="text-5xl p-7">ROUND {current_round +1}</p>
        <p class="text-3xl">"{round.question}"</p>
        <div class="rounded-lg border-4 w-max p-4 mt-10 mb-10 inline-block">
          <p class="text-7xl">{props.game.point_tracker}</p>
        </div>
      </div>

      <div class="rounded border-4 grid grid-rows-4 grid-flow-col  p-3 mx-10 mb-10 mt-5 gap-3 bg-black">
        {round.answers.map((x, index) =>
          <div class="bg-blue-600 font-extrabold uppercase items-center text-center p-5 rounded border-2">
            {x.trig?
              <div class="flex">
                <p class="text-xl text-white flex-grow">{x.ans}</p>
                <p class="text-2xl text-white pr-5">{x.pnt}</p>
              </div>
            :<p class="text-3xl text-yellow-300">{index +1}</p>
            }
          </div>
        )}
      </div>
      <div class="text-3xl flex flex-row px-6 text-center">
        <div class="flex-grow">
          <p class="pb-5">{props.game.teams[0].name}: {props.game.teams[0].points} </p>
          <div>{Array(props.game.teams[0].mistakes).fill(<p>X</p>)}</div>
        </div>
        <div class="flex-grow">
          <p class="pb-5">{props.game.teams[1].name}: {props.game.teams[1].points}</p>
          <div class="">{Array(props.game.teams[1].mistakes).fill(<p>X</p>)}</div>
        </div>
      </div>
    </div>
  )
}
