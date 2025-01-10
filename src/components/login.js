import { useState } from "react";
import { useTheme } from 'next-themes';
import TitleLogo from "@/components/title-logo";
import LanguageSwitcher from "@/components/language";
import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import { ERROR_CODES } from "@/i18n/errorCodes";
import ThemeSwitcher from "@/components/Admin/ThemeSwitcher";

export default function Login(props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setErrorVal] = useState("");
  const [game, setGame] = useState({ settings: { theme: theme || 'default' } });

  function setError(e) {
    setErrorVal(e);
    setTimeout(() => {
      setErrorVal("");
    }, 5000);
  }

  const isValidRoomCode = (code) => code.length === 4;
  const isValidPlayerName = (name) => name.length > 0 && name.length <= 12;

  const handlePlay = () => {
    if(!isValidPlayerName(playerName)) {
      setError(t(ERROR_CODES.MISSING_INPUT, {message: t("name")}));
      return;
    }

    if(!isValidRoomCode(roomCode)) {
      setError(t("room code is not correct length, should be 4 characters"));
      return;
    }

    props.setRoomCode(roomCode);
    props.setPlayerName(playerName);
    props.joinRoom();
  }

  const displayError = props.error || error;

  return (
    <div className={`min-h-screen w-full flex flex-col space-y-10 p-5 bg-background`}>
      <div className="w-full flex justify-between flex-col sm:flex-row gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher game={game} setGame={setGame} send={() => {}} />
      </div>
      <TitleLogo insert="" />
      <div className="flex flex-col">
        <div className="flex flex-row justify-between text-1xl px-2">
          <p className="uppercase text-foreground">{t("room code")}</p>
        </div>
        <input
          className="border-4 border-secondary-600 p-2 rounded-2xl text-2xl uppercase bg-secondary-300 text-foreground"
          id="roomCodeInput"
          onChange={(e) => setRoomCode(e.target.value)}
          maxLength={4}
          value={roomCode}
          placeholder={t("4 letter room code")}
        ></input>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between text-1xl px-2">
          <p className="text-foreground">{t("name")}</p>
          <p className="text-foreground">{12 - playerName.length}</p>
        </div>
        <input
          className="border-4 border-secondary-600 p-2 rounded-2xl text-2xl uppercase bg-secondary-300 text-foreground"
          id="playerNameInput"
          maxLength={12}
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder={t("enter your name")}
        ></input>
      </div>
      <div className="flex flex-row items-center space-x-5">
        <button
          id="joinRoomButton"
          className="shadow-md flex-grow rounded-md bg-success-300 p-4 w-2/3 text-2xl uppercase text-foreground"
          onClick={handlePlay}
        >
          <div className="flex-grow">{t("play")}</div>
        </button>
        <button
          id="hostRoomButton"
          className="shadow-md rounded-md bg-secondary-300 p-4 text-2xl uppercase text-foreground"
          onClick={() => {
            props.hostRoom();
          }}
        >
          {t("host")}
        </button>
      </div>
      {displayError !== "" ? (
        <p id="errorText" className="text-2xl text-failure-700">
          {displayError.code 
            ? t(displayError.code, { message: displayError.message }) 
            : t(displayError)}
        </p>
      ) : null}
    </div>
  );
}
