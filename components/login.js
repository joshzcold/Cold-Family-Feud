import { useState, useEffect, useRef } from "react";
import TitleLogo from "../components/title-logo";
import LanguageSwitcher from "../components/language";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function Login(props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="self-end">
        <LanguageSwitcher />
      </div>
      <TitleLogo insert="" />
      <div className="flex flex-col">
        <div className="flex flex-row justify-between text-1xl px-2">
          <p className="uppercase">{t("room code")}</p>
        </div>
        <input
          className="border-4 border-secondary-600 p-2 rounded-2xl text-2xl uppercase"
          id="roomCodeInput"
          onChange={(e) => {
            props.setRoomCode(e.target.value.toUpperCase());
          }}
          maxLength={4}
          value={props.roomCode}
          placeholder={t("4 letter room code")}
        ></input>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between text-1xl px-2">
          <p className="uppercase">{t("name")}</p>
          <p>{12 - props.playerName.length}</p>
        </div>
        <input
          className="border-4 border-secondary-600 p-2 rounded-2xl text-2xl uppercase"
          id="playerNameInput"
          maxLength={12}
          value={props.playerName}
          onChange={(e) => {
            props.setPlayerName(e.target.value);
          }}
          placeholder={t("enter your name")}
        ></input>
      </div>
      <div className="flex flex-row items-center space-x-5">
        <button
          id="joinRoomButton"
          className="shadow-md flex-grow rounded-md bg-success-300 p-4 w-2/3 text-2xl uppercase"
          onClick={() => {
            props.joinRoom();
          }}
        >
          <div className="flex-grow">{t("play")}</div>
        </button>
        <button
          id="hostRoomButton"
          className="shadow-md rounded-md bg-secondary-300 p-4 text-2xl uppercase"
          onClick={() => {
            props.hostRoom();
          }}
        >
          {t("host")}
        </button>
      </div>
      {props.error !== "" ? (
        <p id="errorText" className="text-2xl text-failure-700">{props.error}</p>
      ) : null}

    </>
  );
}
