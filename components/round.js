export default function Round(props){
  let current_round = props.game.round
  let round = props.game.rounds[current_round]
  return (
    <div >
      <div>
      <h2>Round: {current_round +1}</h2>
      <h2>{round.question}</h2>
      </div>

      <div>
        {round.answers.map(x =>
          <div>
            {x.trig?
            <p>{x.ans}</p>
            :<p>empty</p>
            }
          </div>
        )}
      </div>
      <div>
        <div>
          <h2>{props.game.teams[0].name}: {props.game.teams[0].points}</h2>
        </div>
        <div>
          <h2>{props.game.teams[1].name}: {props.game.teams[1].points}</h2>
        </div>
      </div>
    </div>
  )
}
