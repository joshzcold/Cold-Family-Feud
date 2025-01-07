import 'tailwindcss/tailwind.css';
import TitleLogo from '../title-logo';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Team from './Team';
import RoomCode from './RoomCode';
import Image from 'next/image';

export default function TitlePage(props) {
  const { i18n, t } = useTranslation();
  const [titleSize, setTitleSize] = useState('10%');

  useEffect(() => {
    const handleResize = () => {
      if (props.game.settings.logo_url) {
        setTitleSize(window.innerWidth * 0.75);
      } else {
        setTitleSize(
          window.innerWidth *
            (window.innerWidth < 640
              ? 0.8
              : window.innerWidth < 1024
              ? 0.8
              : window.innerWidth < 1280
              ? 0.7
              : window.innerWidth < 1536
              ? 0.75
              : 0.75)
        );
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [props.game.settings.logo_url]);

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
    <div className="bg-gradient-to-t items-center justify-center from-primary-900 flex flex-col via-primary-200 to-primary-900 min-h-screen min-w-screen py-5">
      {/* Logo Section */}
      <div
        style={{
          width: titleSize,
          transition: 'width 2s',
        }}
        className="align-middle inline-block"
      >
        <div className="flex justify-center w-full ">
          {props.game.settings.logo_url ? (
            <Image
              width={300}
              height={300}
              style={{ objectFit: 'contain' }}
              src={`${props.game.settings.logo_url}?v=${Date.now()}`}
              alt="Game logo"
              priority // Load image immediately
              unoptimized // Skip caching
            />
          ) : (
            <TitleLogo insert={props.game.title_text} size={titleSize} />
          )}
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-4 h-[200px] 2xl:h-[250px]"
        style={{
          width: titleSize,
          transition: 'width 2s',
        }}
      >
        <Team team={props.game.teams[0].name} players={returnTeamMates(0)} />
        <RoomCode code={props.game.room} />
        <Team team={props.game.teams[1].name} players={returnTeamMates(1)} />
      </div>
    </div>
  );
}
