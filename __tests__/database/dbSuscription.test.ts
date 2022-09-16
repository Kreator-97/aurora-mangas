import { User } from '@prisma/client'
import { getAllSubscriptions, getSubscriptionsByUserId } from '../../database/dbSubscriptions'
import prisma from '../../lib/prisma'

describe('getSubscriptionsByUserId', () => {
  let user: User | null = null
  
  beforeAll( async () => {
    user = await prisma.user.findUnique({where: {
      email: 'user@user.com'
    }})

    const serie = await prisma.serie.findFirst()

    await prisma.subscription.create({
      data: {
        paypalSuscriptionId: '123',
        status: 'ACTIVE',
        userId: user?.id || '',
        serieId: serie?.id || '',
      }
    })
  })

  test('getAllSubscriptions should to get all suscriptions', async () => {
    const subscriptions = await getAllSubscriptions()
    expect(subscriptions instanceof Array).toBe(true)
    expect(subscriptions.length).toBe(1)
  })

  test('getSubscriptionsByUserId should to get all subs by a user', async () => {
    const subscriptions = await getSubscriptionsByUserId(user!.id)
    expect(subscriptions instanceof Array).toBe(true)
    expect(subscriptions.length).toBe(1)
  })

  afterAll( async () => {
    await prisma.subscription.deleteMany()
  })

})

