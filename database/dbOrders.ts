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

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({include: { user: true, items: true }})

  return JSON.parse( JSON.stringify(orders) )
}
