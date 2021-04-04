import "tailwindcss/tailwind.css";

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
    <div class="text-center mt-24 mx-20" >
      {props.game.is_final_second?
        <div>
          <div class="text-center my-10">
            <p class="text-3xl">FAST MONEY PT2</p>
          </div>
          <div class="border-8 bg-blue-800 p-5 border-black">
            <div class="flex space-x-6 text-white">
              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.gameCopy.map(copy => 
                <div class="flex space-x-2">
                  <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow ">
                    {props.game.hide_first_round? null:
                    <p class="flex-grow text-2xl">{copy.input }</p>
                    }
                  </div>
                  <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                    {props.game.hide_first_round? null:
                    <p class="text-2xl">{copy.points}</p>
                    }
                  </div>
                </div>
                )}
              </div>


              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map(x => 
                <div class="flex space-x-2">
                  <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow">
                    {x.revealed?
                      <div class="flex">
                        <p class="flex-grow text-2xl">{x.input }</p>
                      </div>
                      :null
                    }
                  </div>
                  <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                    {x.revealed?
                      <div class="flex">
                        <p class="text-2xl">{x.points}</p>
                      </div>
                      :null
                    }
                  </div>
                </div>
                )}
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <div class="bg-black inline-block p-2 rounded">
                <p class='font-bold uppercase text-3xl text-white'>
                  total &nbsp;&nbsp;{final_score}</p>
              </div>
            </div>

          </div>
        </div>
        :
        <div>
          <div class="text-center my-10">
            <p class="text-3xl">FAST MONEY</p>
          </div>
          <div class="border-8 bg-blue-800 p-5 border-black">
            <div class="flex space-x-6 text-white ">
              <div class=" flex-grow rounded  grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map(x => 
                <div class="flex flex-row space-x-2">
                  <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded  flex-grow">
                    {x.revealed?
                      <p class="flex-grow text-2xl">{x.input }</p>
                      :null
                    }
                  </div>
                  <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                    {x.revealed?
                        <p class="text-2xl">{x.points}</p>
                      :null
                    }
                  </div>
                </div>
                )}
              </div>


              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map(x => 
                <div class="flex flex-row space-x-2">
                  <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow">
                  </div>
                  <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                  </div>
                </div>
                )}
              </div>
            </div>
            <div class="mt-6 flex justify-end ">
              <div class="bg-black inline-block p-2 rounded">
                <p class='font-bold uppercase text-3xl text-white'>
                  total &nbsp;&nbsp;{round_one_total}</p>
              </div>
            </div>
          </div>

        </div>
      }

      <div class="rounded-full justify-center inline-block px-5 border-4 py-5 bg-gradient-to-tr from-blue-900 to-blue-700" 
        style={{boxShadow: "3px 3px 2px black",
          transform: "translate(0px, -70px)"}}>
        <p class="self-center text-5xl text-white font-black"style={{textShadow: "1px 2px 4px black"}}>{props.timer}</p>
      </div>

      <div class="text-center">
        {final_score >= 200?
          <p class='text-5xl mt-10 text-green-800'>WIN!</p>:null
        }
      </div>
    </div>
  )
}
