import "tailwindcss/tailwind.css";
import TitleLogo from "./title-logo"
import { useState, useEffect } from 'react';

export default function Title(props){
  const [titleSize, setTitleSize] = useState("10%")

  useEffect(() => {
    setTimeout(setTitleSize(window.innerWidth), 2000)

  }, [])


  return (
    <div class="bg-gradient-to-t  items-center justify-center from-blue-500 flex via-blue-300 to-blue-500  min-h-screen">
      <div  style={{
        width: titleSize,
        transition: "width 2s",

      }}  class="align-middle inline-block ">
        <TitleLogo insert={props.game.title_text} size={titleSize}/>
        <div class="flex flex-row text-center py-20">
          <p class="text-4xl flex-grow text-white"> {props.game.teams[0].name}</p>
          <p class="text-4xl flex-grow text-white"> {props.game.teams[1].name}</p>
        </div>
      </div>
    </div>
  )
}
