import { Subscription } from '@prisma/client'
import prisma from '../lib/prisma'

export const getSubscriptionsByUserId = async (userId:string): Promise<Subscription> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: { serie: true, user: true }
  })

  return JSON.parse(JSON.stringify(subscriptions))
}
