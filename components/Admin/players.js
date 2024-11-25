import { useTranslation } from "react-i18next";
import "i18n/i18n";
import "tailwindcss/tailwind.css";
import { useState, useEffect, useRef } from "react";

export default function Players(props) {
  let game = props.game;
  const { i18n, t } = useTranslation();
  let team1 = [];
  let team2 = [];

  if (game.registeredPlayers) {
    for (const [id, player] of Object.entries(game.registeredPlayers)) {
      if (player.hasOwnProperty("team")) {
        let content = { id: id, name: player.name };
        player.team === 0 ? team1.push(content) : team2.push(content);
      }
    }
  }

  function teamSection(team) {
    return (
      <div>
        {team.map((x, i) => (
          <div className="border-2 flex flex-row space-x-5 items-center m-2">
            {/* information about player */}
            <div className="flex-grow">
              <p className="uppercase text-foreground">{x.name}</p>
            </div>
            <button
              className="border-4 bg-failure-300 hover:bg-failure-500 p-2 rounded-lg"
              onClick={() => {
                // props.send({action: "quit", id: })
                props.ws.current.send(
                  JSON.stringify({
                    action: "quit",
                    host: false,
                    id: x.id,
                    room: props.room,
                  })
                );
              }}
            >
              {/* cancel.svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 717 718"
              >
                <path
                  d="M651.22 154c98 139 85 334-40 459s-318 137-458 40c-16-12-34-26-49-40c-15-15-28-32-39-49c-98-139-86-334 39-459s319-137 459-40c16 12 33 26 48 40c15 15 29 32 40 49zm-522 345l370-370c-104-63-242-50-331 39c-90 90-102 228-39 331zm458-280l-370 369c104 63 242 50 331-39c90-90 102-227 39-330z"
                  fill="#ffffff"
                />
                <rect
                  x="0"
                  y="0"
                  width="717"
                  height="718"
                  fill="rgba(0, 0, 0, 0)"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-grow ">
      <div className="h-48 overflow-y-scroll border-4 rounded p-2 text-center flex flex-row flex-grow">
        {/* team 1 section */}
        <div className="flex-grow">
          <p className="text-foreground">{game.teams[0].name}</p>
          <hr />
          {teamSection(team1)}
        </div>
        {/* seperator */}
        <div className="bg-secondary-300 border h-full" />
        {/* team 2 section */}
        <div className="flex-grow">
          <p className="text-foreground">{game.teams[1].name}</p>
          <hr />
          {teamSection(team2)}
        </div>
      </div>
    </div>
  );
}
