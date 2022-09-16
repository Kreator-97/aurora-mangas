import { Order } from '@prisma/client'
import prisma from '../lib/prisma'

export const getOrdersByUserId = async (userId:string):Promise<Order[]> => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  })
  return JSON.parse(JSON.stringify(orders))
}

export const getOrderById = async (orderId:string): Promise<Order | null> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: { serie: true }
          },
        }
      },
      user: {
        select: {
          fullname: true, imgURL: true, id: true, address: true
        }
      }
    }
  })

  return JSON.parse(JSON.stringify(order))
}

export const getAllOrders = async ():Promise<Order[]> => {
  const orders = await prisma.order.findMany({include: { user: true, items: true }})

  return JSON.parse( JSON.stringify(orders) )
}

export const checkPendingOrderTime = async (userId?:string):Promise<Order | null> => {
  // this function check the orders by a user that are pending and was created more than 5 minutes ago
  if( !userId ) return null

  const orders = await prisma.order.findMany({ where: { status: 'PENDING', userId }})
  const ordersToBeCancel: string[] = []

  orders.forEach((order) => {
    const orderTime = order.date.getTime()
    const fiveMinutesInMs = 300000
    if( (Date.now() - orderTime) > fiveMinutesInMs ) {
      ordersToBeCancel.push(order.id)
    }
  })

  if( ordersToBeCancel.length > 0 ) {
    return await cancelOrders(ordersToBeCancel)
  }

  return null
}

const cancelOrders = async (ids: string[]) => {
  // this function cancel all orders passed and return the last one
  for( const id of ids ) {
    await prisma.order.updateMany({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    })
  }

  const lastOrder = await prisma.order.findUnique({ 
    where: { id: ids[ids.length-1] },
    include: { items: {
      include: {
        product: {
          include: {
            serie: true
          }
        },
      }
    } }
  })
  return JSON.parse( JSON.stringify(lastOrder))
}
