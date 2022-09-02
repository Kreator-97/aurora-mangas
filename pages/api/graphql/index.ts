import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'

import { typeDefs } from '../../../graphql/schema'
import { resolvers } from '../../../graphql/resolvers'
import { getSession } from 'next-auth/react'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'

const cors = Cors({
  origin: 'https://studio.apollographql.com',
  allowCredentials: true
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const session = await getSession({ req })
    return { session }
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground( {
      settings: {
        'request.credentials': 'include',
      },
    }),
  ],
})

const startServer = apolloServer.start()

export default cors(
  async function handler (req: any, res: any) {
    if( req.method === 'OPTIONS' ) {
      res.end()
      return false
    }
    await startServer
    await apolloServer.createHandler({
      path: '/api/graphql'
    })(req, res)
  }
)

export const config = {
  api: {
    bodyParser: false
  }
}
