import "tailwindcss/tailwind.css";
import TitleLogo from "./title-logo";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Title(props) {
  const {i18n, t} = useTranslation();
  const [titleSize, setTitleSize] = useState("10%");

  useEffect(() => {
    if (props.game.settings.logo_url) {
      setTimeout(() => setTitleSize(window.innerWidth * 0.4), 2000);
    } else {
      setTimeout(() => setTitleSize(window.innerWidth * 0.7), 2000);
    }
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
    <div className="bg-gradient-to-t items-center justify-center from-primary-900 flex via-primary-200 to-primary-900 min-h-screen min-w-screen">
      <div
        style={{
          width: titleSize,
          transition: "width 2s",
        }}
        className="align-middle inline-block"
      >
        {/* Logo Section */}
        <div className="flex flex-col space-y-10">
          <div className="flex-grow">
            {props.game.settings.logo_url ? (
              <img
                className="w-full h-[300px] min-h-[200px] object-contain"
                src={`${props.game.settings.logo_url}`}
                size={titleSize}
                alt="Game logo"
              />
            ) : (
              <TitleLogo insert={props.game.title_text} size={titleSize} />
            )}
          </div>

          <div className="grid grid-cols-3">
            {/* Team 1 section */}
            <div className="flex flex-row text-center bg-secondary-500 rounded-xl shadow-lg">
              <div className="flex-grow">
                <p className="text-4xl flex-grow text-foreground font-bold bg-secondary-700 rounded-t-xl py-3 shadow-sm">
                  {props.game.teams[0].name}
                </p>
                <div className="flex flex-wrap flex-row justify-center">
                  {returnTeamMates(0).map((m) => (
                    <div className="bg-primary-200 m-2 rounded-lg w-32 p-2">
                      <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Info section */}
            <div className="flex flex-col">
              {/* Room Code*/}
              <div className="flex flex-row justify-center text-center">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-semibold text-foreground p-1 px-4 pb-0 rounded-t-xl bg-secondary-500 shadow-lg">
                    {t('Room Code')}
                  </div>
                  <p className="text-6xl font-bold p-6 text-foreground rounded-xl bg-secondary-500 shadow-lg">
                    {props.game.room}
                  </p>
                </div>
              </div>
              {/* URL */}
              {process.env.NEXT_PUBLIC_TITLE_URL && (
                <div className="flex flex-row justify-center text-center mt-4">
                  <span className="text-4xl p-6 text-foreground rounded-xl bg-secondary-500 shadow-lg transition-colors duration-200">
                    {t('Join at')} <span className="font-bold">{process.env.NEXT_PUBLIC_TITLE_URL}</span>
                  </span>
                </div>
              )}
            </div>
            {/* Team 2 section */}
            <div className="flex flex-row text-center bg-secondary-500 rounded-xl">
              <div className="flex-grow">
                <p className="text-4xl flex-grow text-foreground font-bold bg-secondary-700 rounded-t-xl py-2">
                  {props.game.teams[1].name}
                </p>
                <div className="flex flex-wrap flex-row justify-center">
                  {returnTeamMates(1).map((m) => (
                    <div className="bg-secondary-500 m-2 rounded w-32 p-2">
                      <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
