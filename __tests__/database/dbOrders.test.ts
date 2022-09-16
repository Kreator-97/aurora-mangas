import { User } from '@prisma/client'
import prisma from '../../lib/prisma'

import {
  checkPendingOrderTime,
  getAllOrders,
  getOrderById,
  getOrdersByUserId
} from '../../database/dbOrders'

describe('test on dbOrders file', () => {
  let user: User | null = null

  beforeAll( async () => {
    user = await prisma.user.findUnique({
      where: { email : 'user@user.com' },
    })

    // find any manga
    const manga = await prisma.manga.findFirst()

    await prisma.order.createMany({
      data: [
        {
          total: manga!.price,
          userId: user!.id,
          status: 'PENDING',
          // this one was created 10 minutes ago
          date: new Date(Date.now() - 600000)
        },
        {
          total: manga!.price * 2,
          userId: user!.id,
          status: 'PENDING',
        },
        {
          total: manga!.price * 3,
          userId: user!.id,
          status: 'PENDING',
        },
      ]
    })
  })

  test('getOrdersByUserId should to return an array with all orders by a user', async () => {
    const orders = await getOrdersByUserId(user ? user.id : '')

    expect(orders instanceof Array).toBe(true)
    expect(orders.length).toBe(3)
  })

  test('getOrderById should to get one order', async () => {
    const o = await prisma.order.findFirst()
    const order = await getOrderById(o!.id)

    expect(order).toMatchObject({
      total: expect.any( Number ),
      items: expect.any( Array ),
      user: expect.any( Object ),
    })
  })

  test('getAllOrders should to get all orders in db', async () => {
    const orders = await getAllOrders()

    expect(orders instanceof Array).toBe(true)
    expect(orders.length).toBe(3)
  })

  test('checkPendingOrderTime should to return null when userId arg is undefined', async () => {
    const result = await checkPendingOrderTime(undefined)

    expect(result).toBe(null)
  })

  test('checkPendingOrderTime should to cancel all orders by a user which status equals to PENDING and was created more than 5 minutes ago and return order cancelled', async () => {
    const orderCancelled = await checkPendingOrderTime(user!.id)

    const ordersCancelled = await prisma.order.findMany({ where: {
      status: 'CANCELLED'
    }})

    expect(ordersCancelled.length).toBe(1)
    expect(orderCancelled?.id).toBe(ordersCancelled[0].id)
  })


  afterAll( async () => {
    await prisma.order.deleteMany()
  })
})
