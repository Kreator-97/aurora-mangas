import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'

import { store } from '../app/store'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={ store }>
        <Component {...pageProps } />
      </Provider>
    </SessionProvider>
  ) 
}

export default MyApp
