import "tailwindcss/tailwind.css";

let gameCopy

export default function Final(props){

  let round_one_total = 0
  let round_two_total = 0
  let final_score = 0
  if(props.game.gameCopy != null){
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
    props.game.final_round.forEach(round => {round_one_total = round_one_total + round.points})
  }

  return (
    <div >

      {props.game.is_final_second?

        <div>
          <div class="text-center my-10">
            <p class="text-3xl">FAST MONEY PT2</p>
          </div>
          <div>
            <div class="flex space-x-4 m-5 text-white">
              <div class="flex-grow rounded border-4 grid grid-rows-4 grid-flow-col  p-3  gap-3 ">
                {props.game.gameCopy.map(copy => 
                <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded border-2 min-w-full">
                  {props.game.hide_first_round? null:
                  <div class="flex">
                    <p class="flex-grow text-2xl">{copy.input }</p>
                    <p class="text-2xl">{copy.points}</p>
                  </div>
                  }
                </div>
                )}
              </div>


              <div class=" flex-grow rounded border-4 grid grid-rows-4 grid-flow-col  p-3  gap-3 ">
                {props.game.final_round.map(x => 
                <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded border-2">
                  {x.revealed?
                    <div class="flex">
                      <p class="flex-grow text-2xl">{x.input }</p>
                      <p class="text-2xl">{x.points}</p>
                    </div>
                    :null
                  }
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        :
        <div>
          <div class="text-center my-10">
            <p class="text-3xl">FAST MONEY</p>
          </div>
          <div class="flex space-x-4 m-5 text-white">
            <div class=" flex-grow rounded border-4 grid grid-rows-4 grid-flow-col  p-3  gap-3 ">
              {props.game.final_round.map(x => 
              <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded border-2">
                  {x.revealed?
                    <div class="flex">
                      <p class="flex-grow text-2xl">{x.input }</p>
                      <p class="text-2xl">{x.points}</p>
                    </div>
                    :null
                  }
              </div>
              )}
            </div>


            <div class=" flex-grow rounded border-4 grid grid-rows-4 grid-flow-col  p-3  gap-3 ">
              {props.game.final_round.map(x => 
              <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded border-2">
                <div class="flex">
                  <p class="flex-grow text-2xl"></p>
                  <p class="text-2xl"></p>
                </div>
              </div>
              )}
            </div>
          </div>

        </div>
      }
      <div class="text-3xl flex flex-row p-6 text-center">
        <div class="flex-grow">
          <p>Total 1: {round_one_total}</p>
        </div>
        <div class="flex-grow">
          <p>Total 2: {round_two_total}</p>
        </div>
      </div>
      <div class="flex mt-10 text-center">
        {final_score >= 200?
          <div class="inline-block w-max flex-grow">
            <p class='text-3xl'>Final Score: {final_score}</p>
            <p class='text-5xl mt-10 text-green-800'>WIN!</p>
          </div>
          :
          <div class="inline-block flex-grow">
            <p class='text-3xl'>Final Score: {final_score}</p>
          </div>
        }
      </div>
    </div>
  )
}
