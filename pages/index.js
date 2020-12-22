import { useState, useEffect } from 'react';
import Head from 'next/head'


export default function Home(){


  return (
    <div>
      <Head>
        <title>AD Dashboard</title>
        <link rel="icon" href="/dashboard/favicon.svg" ></link>
      </Head>
      <main>
        <h1>go to /admin or /game</h1>
      </main>
    </div>
  )
}

