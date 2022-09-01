import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { fetch } from 'cross-fetch'

const link = new HttpLink({
  uri: 'http://localhost:3000/api/graphql',
  fetch
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
