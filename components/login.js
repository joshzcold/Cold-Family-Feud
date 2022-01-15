import { useState, useEffect, useRef } from "react";
import TitleLogo from "../components/title-logo";
import LanguageSwitcher from "../components/language";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function Login(props) {
  const { t } = useTranslation();
  return (
    <>
      <div class="self-end">
        <LanguageSwitcher />
      </div>
      <TitleLogo insert="" />
      <div class="flex flex-col">
        <div class="flex flex-row justify-between text-1xl px-2">
          <p class="uppercase">{t("room code")}</p>
        </div>
        <input
          class="border-4 border-gray-600 p-2 rounded-2xl text-2xl uppercase"
          id="roomcode"
          onChange={(e) => {
            props.setRoomCode(e.target.value);
          }}
          maxLength={4}
          value={props.roomCode}
          placeholder={t("4 letter room code")}
        ></input>
      </div>

      <div class="flex flex-col">
        <div class="flex flex-row justify-between text-1xl px-2">
          <p class="uppercase">{t("name")}</p>
          <p>{12 - props.playerName.length}</p>
        </div>
        <input
          class="border-4 border-gray-600 p-2 rounded-2xl text-2xl uppercase"
          id="playername"
          maxLength={12}
          value={props.playerName}
          onChange={(e) => {
            props.setPlayerName(e.target.value);
          }}
          placeholder={t("enter your name")}
        ></input>
      </div>
      <div class="flex flex-row items-center space-x-5">
        <button
          class="shadow-md flex-grow rounded-md bg-green-300 p-4 w-2/3 text-2xl uppercase"
          onClick={() => {
            props.joinRoom();
          }}
        >
          <div class="flex-grow">{t("play")}</div>
        </button>
        <button
          class="shadow-md rounded-md bg-gray-300 p-4 text-2xl uppercase"
          onClick={() => {
            props.hostRoom();
          }}
        >
          {t("host")}
        </button>
      </div>

      {props.error !== "" ? (
        <p class="text-2xl text-red-700">{props.error}</p>
      ) : null}
    </>
  );
}
