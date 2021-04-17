import { useState, useEffect } from 'react';
import Head from 'next/head'
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import '../locales/i18n'
import LanguageSwitcher from "../components/language"

export default function Home(){
  const{ t } = useTranslation();
  return (
    <div>
      <Head>
        <title>{t("gameTradeMark")}</title>
        <link rel="icon" href="/dashboard/favicon.svg" ></link>
      </Head>
      <main>
        <div class="flex flex-row space-x-5">
          <p>{t("language")}:</p>
          <LanguageSwitcher/>
        </div>
        <div class="h-screen w-screen flex flex-col justify-center text-center space-y-20">
          <p class="text-4xl">{t("gameTradeMark")}</p>
          <div>
            <p class="text-xl text-black text-opacity-50">{t("startHelpText")}</p>
            <div class="pt-4 flex flex-row  space-x-10 items-center justify-center">
              <a href="/admin">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  {t("adminConsole")} 
                </button>
              </a>
              <a href="/game">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  {t("gameWindow")}
                </button>
              </a>
              <a href="/new">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  {t("createGame")}
                </button>
              </a>
              <a href="/buzzer">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  {t("buzzer")}
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

