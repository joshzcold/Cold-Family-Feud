
let gameCopy

export default function Final(props){

  return (
    <div >

      {props.game.is_final_second?
        <div>
          <h2>Fast Money Final Round pt2</h2>
          <div>
            {props.game.gameCopy.map(copy => 
            <div>
              <p>{ copy.input } {copy.points}</p>
            </div>
            )}
          </div>

          <div>
            {props.game.final_round.map(x => 
            <div>
              <p>{ x.input } {x.points}</p>
            </div>
            )}
          </div>
        </div>
        :
        <div>
          <h2>Fast Money Final Round</h2>
          {props.game.final_round.map(x => 
          <div>
            <p>{ x.input } {x.points}</p>
          </div>
          )}
        </div>
      }
    </div>
  )
}
