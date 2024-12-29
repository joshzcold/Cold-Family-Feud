import 'tailwindcss/tailwind.css';
import TitleLogo from '../title-logo';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Team from './Team';
import TitleUrl from './TitleUrl';
import RoomCode from './RoomCode';

export default function TitlePage(props) {
  const { i18n, t } = useTranslation();
  const [titleSize, setTitleSize] = useState('10%');

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
          transition: 'width 2s',
        }}
        className="align-middle inline-block"
      >
        {/* Logo Section */}
        <div className="flex flex-col space-y-10">
          <div className="flex justify-center w-full">
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

          <div className="grid grid-cols-3 min-h-[220px]">
            <Team team={props.game.teams[0].name} players={returnTeamMates(0)} />

            <div className="flex flex-col">
              <RoomCode code={props.game.room} />
              <TitleUrl />
            </div>

            <Team team={props.game.teams[1].name} players={returnTeamMates(1)} />
          </div>
        </div>
      </div>
    </div>
  );
}
