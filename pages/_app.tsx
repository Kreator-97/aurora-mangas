import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { client } from '../graphql/client'
import { store } from '../app/store'
import '../styles/globals.css'
import 'animate.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{
        'client-id': process.env.NEXT_PUBLIC_PAYPAY_CLIENT_ID || '', 'buyer-country': 'MX',
        currency: 'MXN',
        vault: true,
      }}>
        <ApolloProvider client={ client }>
          <Provider store={ store }>
            <Component {...pageProps } />
          </Provider>
        </ApolloProvider>
      </PayPalScriptProvider>
    </SessionProvider>
  ) 
}

export default MyApp
