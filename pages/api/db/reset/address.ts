import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

type Data = {
  msg: string
}

export default async function resetAddresses(req: NextApiRequest, res: NextApiResponse<Data>) {

  if( process.env.NODE_ENV === 'production') {
    return res.status(400).json({msg: 'Cannot reset db on production' })
  }
  
  if( req.method !== 'POST' ) {
    return res.status(400).json({msg: 'This endpoint only accept POST request' })
  }

  await prisma.address.deleteMany()

  res.status(202).json({ msg: 'ok' })
} 
