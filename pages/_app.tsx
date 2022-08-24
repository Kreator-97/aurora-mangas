import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql/client'
import { store } from '../app/store'
import '../styles/globals.css'
import 'animate.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ApolloProvider client={ client }>
        <Provider store={ store }>
          <Component {...pageProps } />
        </Provider>
      </ApolloProvider>
    </SessionProvider>
  ) 
}

export default MyApp
