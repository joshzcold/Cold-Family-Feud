import 'styles.css'
import ThemeProvider from '../components/ThemeProvider'
import Head from 'next/head'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Prevent unloaded theme on page refresh causing white flash if dark theme */}
      <Head>
        <script dangerouslySetInnerHTML={{
          __html: `
            var theme = localStorage.getItem('theme') || 'default'
            document.documentElement.classList.add(theme)
          `
        }} />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
