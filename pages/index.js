import { useState, useEffect } from 'react';
import Head from 'next/head'
import "tailwindcss/tailwind.css";


export default function Home(){


  return (
    <div>
      <Head>
        <title>AD Dashboard</title>
        <link rel="icon" href="/dashboard/favicon.svg" ></link>
      </Head>
      <main>
        <div class="h-screen w-screen flex flex-col justify-center text-center space-y-20">
          <p class="text-4xl">Cold Family Feud</p>
          <div>
            <p class="text-xl text-black text-opacity-50">Click on the links below to control the game. </p>
            <div class="pt-4 flex flex-row  space-x-10 items-center justify-center">
              <a href="/admin">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  Admin Console
                </button>
              </a>
              <a href="/game">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  Game Window
                </button>
              </a>
              <a href="/new">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  Create Game
                </button>
              </a>
              <a href="/buzzer">
                <button class="hover:shadow-md rounded-md bg-blue-200 p-2">
                  Buzzer
                </button>
              </a>
              {/* <a href="/"> */}
              {/*   <button class="hover:shadow-md rounded-md bg-blue-200 p-2"> */}
              {/*     Instructions */}
              {/*   </button> */}
              {/* </a> */}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

