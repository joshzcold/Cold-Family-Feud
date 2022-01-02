import "tailwindcss/tailwind.css";
import TitleLogo from "./title-logo";
import { useState, useEffect } from "react";

export default function Title(props) {
  const [titleSize, setTitleSize] = useState("10%");

  useEffect(() => {
    setTimeout(setTitleSize(window.innerWidth * 0.7), 2000);
  }, []);

  function returnTeamMates(team) {
    let players = [];
    console.debug(props.game);
    Object.keys(props.game.registeredPlayers).forEach((k) => {
      console.debug(k);
      if (props.game.registeredPlayers[k].team === team) {
        players.push(props.game.registeredPlayers[k].name);
      }
    });
    console.debug(players);
    return players;
  }

  return (
    <div class="bg-gradient-to-t items-center justify-center from-blue-500 flex via-blue-300 to-blue-500 min-h-screen min-w-screen">
      <div
        style={{
          width: titleSize,
          transition: "width 2s",
        }}
        class="align-middle inline-block"
      >
        <div class="flex flex-col space-y-10">
          <div class="flex-grow">
            <TitleLogo insert={props.game.title_text} size={titleSize} />
          </div>
          <div class="flex flex-row justify-center text-center">
            <p class="text-4xl font-bold p-5 bg-blue-200 rounded">
              {props.game.room}
            </p>
          </div>
          <div class="flex flex-row text-center">
            <div class="flex-grow">
              <p class="text-4xl flex-grow text-white">
                {" "}
                {props.game.teams[0].name}
              </p>
              {returnTeamMates(0).map((m) => (
                <div class="bg-blue-200 m-2 rounded">
                  <p class="font-bold">{m}</p>
                </div>
              ))}
            </div>
            <div class="flex-grow">
              <p class="text-4xl flex-grow text-white">
                {" "}
                {props.game.teams[1].name}
              </p>
              {returnTeamMates(1).map((m) => (
                <div class="bg-blue-200 m-2 rounded">
                  <p class="font-bold">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
