import "tailwindcss/tailwind.css";

export default function Round(props){
  let current_round = props.game.round
  let round = props.game.rounds[current_round]
  return (
    <div >
      <div class="text-center p-1 pt-20">
      <p class="text-7xl">Round {current_round +1}</p>
      <p class="text-3xl">{round.question}</p>
      </div>

      <div class="grid grid-rows-4 grid-flow-col p-16 gap-3">
        {round.answers.map((x, index) =>
          <div class="items-center text-center p-5 rounded border-2">
            {x.trig?
              <div class="flex">
                <p class="text-xl flex-grow">{x.ans}</p>
                <p class="text-xl">{x.pnt}</p>
              </div>
            :<p>{index +1}</p>
            }
          </div>
        )}
      </div>
      <div class="text-3xl flex flex-row p-16 text-center">
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
