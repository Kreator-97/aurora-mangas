import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { fetch } from 'cross-fetch'

const link = new HttpLink({
  uri: process.env.NODE_ENV === 'production' ? '/api/graphql' : 'http://localhost:3000/api/graphql',
  fetch
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
