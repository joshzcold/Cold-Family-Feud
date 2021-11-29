import { useState, useEffect, useRef } from "react";
import TitleNoInsert from "../components/title-no-insert";
import LanguageSwitcher from "../components/language";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function Login(props) {
  const { t } = useTranslation();
  console.log(props.error)
  return (
    <>
      <div class="flex flex-col items-center pt-12 space-y-5 h-screen">
        <div class="lg:w-1/4 w-1/2">
          <TitleNoInsert />
        </div>
        <div class="flex flex-col space-y-12 flex-grow items-center">
          <div>
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

          <div>
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

          <button
            class="shadow-md rounded-md bg-blue-200 py-4 w-2/3 text-2xl uppercase"
            onClick={() => {
              props.joinRoom();
            }}
          >
            {t("play")}
          </button>
          {props.error !== "" ? <p class="text-2xl text-red-700">{props.error}</p> : null}
          <div class="bg-blue-400 flex-grow p-5 w-screen">
            <div class="flex flex-row  h-full items-center justify-around">
              <LanguageSwitcher />
              <button
                class="shadow-md rounded-md bg-gray-300 p-4 text-2xl uppercase"
                onClick={() => {
                  props.hostRoom();
                }}
              >
                {t("host")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
