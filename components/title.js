import "tailwindcss/tailwind.css";
import { useState, useEffect } from 'react';

export default function Title(props){
  const [titleSize, setTitleSize] = useState("10%")

  useEffect(() => {
    setTimeout(setTitleSize("80%"), 2000)
    
  }, [])
  

  return (
    <div class="bg-gradient-to-t  items-center justify-center from-blue-500 flex via-blue-300 to-blue-500  min-h-screen">
      <div  style={{
        width: titleSize,
        transition: "width 2s",

        }}  class="align-middle inline-block ">
        <img src="title.png"/>
      </div>
    </div>
  )
}
