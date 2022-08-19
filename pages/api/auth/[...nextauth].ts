import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

import { dbUsers } from '../../../database'

export default NextAuth({
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        const { email, password } = credentials!
        const user = await dbUsers.authenticateUserWithEmailPassword(email, password)
       
        return user
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || ''
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  jwt: {
  },
  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 86400,
  },
  callbacks: {
    async jwt({token, account, user}) {

      if( account ) {
        token.accessToken = account.access_token
        switch(account.type) {
          case 'credentials':
            token.user = user
            break
          case 'oauth': {
            token.user = await dbUsers.oAuthToDBUser(user!.email!, user!.name!, user!.image!)
            break
          }
        }
      }
      
      return token
    },
    async session({session, token, user}) {
      session.accessToken = token.accessToken
      session.user = token.user as any
      return session
    },
  }
})
