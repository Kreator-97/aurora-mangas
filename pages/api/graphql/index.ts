import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'

import { schema } from '../../../graphql/schema'
import { createContext } from '../../../graphql/context'

const cors = Cors({
  origin: 'https://studio.apollographql.com',
  allowCredentials: true
})

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    return await createContext(req, res)
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
