import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import { Eye, EyeOff } from "lucide-react";

export default function Players(props) {
  let game = props.game;
  const { i18n, t } = useTranslation();
  let team1 = [];
  let team2 = [];

  if (game.registeredPlayers) {
    for (const [id, player] of Object.entries(game.registeredPlayers)) {
      if (player.hasOwnProperty("team")) {
        let content = { id: id, name: player.name, hidden: player.hidden };
        player.team === 0 ? team1.push(content) : team2.push(content);
      }
    }
  }

  function teamSection(team, teamNumber) {
    return (
      <div>
        {team.map((x, i) => (
          <div key={`teamSection-player-${x.id}`} className="m-2 flex flex-row items-center space-x-5 border-2">
            {/* information about player */}
            <div className="grow">
              <p className="uppercase text-foreground">{x.name}</p>
            </div>
            <div className="flex flex-row space-x-2">
              {/* Toggle visibility button */}
              <button
                className={`border-4 ${x.hidden ? "bg-secondary-300" : "bg-success-300"} rounded-lg p-2 hover:opacity-80`}
                id={`player${i}Team${teamNumber}HideGameButton`}
                onClick={() => {
                  game.registeredPlayers[x.id].hidden = !game.registeredPlayers[x.id].hidden;
                  props.setGame((prv) => ({ ...prv }));
                  props.ws.current.send(
                    JSON.stringify({
                      action: "data",
                      data: game,
                      room: props.room,
                    })
                  );
                }}
              >
                {x.hidden ? <EyeOff /> : <Eye />}
              </button>
              {/* Remove player button */}
              <button
                id={`player${i}Team${teamNumber}QuitButton`}
                className="rounded-lg border-4 bg-failure-300 p-2 hover:bg-failure-500"
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
                  <rect x="0" y="0" width="717" height="718" fill="rgba(0, 0, 0, 0)" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grow ">
      <div className="flex h-48 grow flex-row overflow-y-scroll rounded border-4 p-2 text-center">
        {/* team 1 section */}
        <div className="grow">
          <p className="text-foreground">{game.teams[0].name}</p>
          <hr />
          {teamSection(team1, 1)}
        </div>
        {/* seperator */}
        <div className="h-full border bg-secondary-300" />
        {/* team 2 section */}
        <div className="grow">
          <p className="text-foreground">{game.teams[1].name}</p>
          <hr />
          {teamSection(team2, 2)}
        </div>
      </div>
    </div>
  );
}
