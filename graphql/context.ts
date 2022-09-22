import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

export type Context = {
  prisma: typeof prisma
  session: Session | null
}

export async function createContext(req: any, res: any):Promise<Context> {
  const session = await getSession({ req })

  return {
    prisma,
    session
  }
}
