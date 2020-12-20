
let gameCopy

export default function Final(props){

  let round_one_total = 0
  let round_two_total = 0
  let final_score = 0
  if(props.game.gameCopy != null){
    console.log("HERE")
    props.game.gameCopy.forEach(round => {
      console.log("round one total: ",round_one_total)
      round_one_total = round_one_total + round.points
    })
    props.game.final_round.forEach(round => {
      console.log("round two total", round_two_total)
      round_two_total = round_two_total + round.points
    })
    final_score = round_one_total + round_two_total
  }else{
    console.log("ELSE")
    props.game.final_round.forEach(round => {round_one_total = round_one_total + round.points})
  }

  return (
    <div >

      {props.game.is_final_second?
        <div>
          <h2>Fast Money Final Round pt2</h2>
          {props.game.hide_first_round? 
            <p>First Round Hidden</p>:
            <div>
              {props.game.gameCopy.map(copy => 
              <div>
                <p>{ copy.input } {copy.points}</p>
              </div>
              )}
            </div>

          }

          <div>
            {props.game.final_round.map(x => 
            <div>
              <p>{ x.input } {x.points}</p>
            </div>
            )}
          </div>
          <div>
            <p>Total 1: {round_one_total}</p>
          </div>
          <div>
            <p>Total 2: {round_two_total}</p>
          </div>
          {final_score >= 200?
            <div>
              <p style={{color: "green"}}>Final Score {final_score} Win !</p>
            </div>
            :
            <div>
              <p>Final Score {final_score}</p>
            </div>
          }
        </div>
        :
        <div>
          <h2>Fast Money Final Round</h2>
          {props.game.final_round.map(x => 
          <div>
              {x.revealed? <p>{ x.input } {x.points}</p>:null }
          </div>
          )}
          <div>
            <p>Total: {round_one_total}</p>
          </div>
        </div>
      }
    </div>
  )
}
