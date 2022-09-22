import { extendType, intArg, list, nonNull, nullable, objectType, stringArg } from 'nexus'

import { Item, ItemsInputType } from './Items'
import { itemResolver, orderResolver } from '../resolvers'
import { calcCartTotal } from '../../database/dbMangas'
import { getPaypalBearerToken } from '../../util/paypal'
import { dbMangas } from '../../database'

export const Order = objectType({
  name: 'Order',
  description: 'Contiene la información de la orden',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.int('total')
    t.list.field('items', {
      type: Item,
      resolve: itemResolver,
    })
  }
})

export const orderQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('orders', {
      description: 'Listado de ordernes. Se necesita autorización',
      type: Order,
      resolve: orderResolver,
    })
  },
})

export const ordersByIdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('ordersByUserId', {
      type: list( nullable(Order) ),
      args: {
        userId: nonNull( stringArg() )
      },
      resolve: async (root, { userId }, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId }
        })

        if( !user ) {
          return null
        }

        const orders = await ctx.prisma.order.findMany({
          where: { userId }
        })

        return orders
      }
    })
  },
})

const OrderResponse = objectType({
  name: 'OrderResponse',
  definition(t) {
    t.implements('Response')
    t.string('orderId')
  },
})

export const createOrder = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOrder', {
      type: OrderResponse,
      args: {
        total: nonNull(intArg()),
        items: nonNull(list(nonNull(ItemsInputType))),
      },
      resolve: async (root, args, ctx) => {
        const { session } = ctx
        if( !session ) {
          return {
            message: 'Token not sent',
            ok: false,
            error: 'Authentication failed'
          }
        }

        const { items } = args

        const total = await calcCartTotal(items, args.total)
        if( typeof total === 'string' ) {
          return {
            message: total,
            error: 'El monto calculado no coincide',
            ok: false,
          }
        }

        try {
          const order = await ctx.prisma.order.create({
            data: {
              user: {
                connect: {
                  id: session.user.id
                }
              },
              total,
              items: {
                createMany: {
                  data: items.map( (i: any) => ({
                    amount: i.amount,
                    productId: i.productId
                  }))
                }
              }
            }
          })
  
          return {
            message: 'Orden de pago creada',
            error: null,
            ok: true,
            orderId: order.id,
          }
        } catch (error: any) {
          console.error(error)
          return {
            message: 'Ocurrió un error al realizar la orden. Contacte con el administrador',
            error: error.message,
            ok: false,
          }
        }
      }
    })
  },
})

export const confirmPaypalOrder = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('confirmPaypalOrder', {
      type: 'ResponseType',
      description: 'Confirm the paypal order using paypal api',
      args: {
        paypalOrderId: nonNull(stringArg()),
        orderId: nonNull(stringArg()),
      },
      async resolve(root, args, ctx) {
        const { paypalOrderId, orderId } = args
      
        const order = await ctx.prisma.order.findUnique({
          where: { id: orderId }
        })

        if( !order ) {
          return {
            message: `La orden con id "${orderId}" no existe`,
            ok: false,
            error: 'Orden no existe',
          }
        }

        if( ctx.session?.user.id !== order.userId ) {
          return {
            message: 'Este usuario no puede confirma esta orden de pago',
            ok: false,
            error: 'Error de authenticación',
          }
        }

        try {
          const paypalBearerToken = await getPaypalBearerToken()

          if( !paypalBearerToken) {
            return {
              message: 'Ocurrió un error al intentar obtener el token de paypal',
              ok: false,
              error: 'Authentication failed',
            }
          }

          const paypal_orders_url = process.env.PAYPAL_ORDERS_URL

          const res = await fetch(`${paypal_orders_url}/${paypalOrderId}`, {
            headers: {
              'Authorization': `Bearer ${paypalBearerToken}`
            }
          })

          const paypalOrder = await res.json()
          if( paypalOrder.status !== 'COMPLETED' ) {
            return {
              message: 'Orden no completada',
              ok: false,
              error: null,
            }
          }

          // verify total match
          if( Number(paypalOrder.purchase_units[0].amount.value) !== order.total ) {
            return {
              message: 'No se pudo confirmar el pago',
              ok: false,
              error: 'Los montos de paypal no coinciden con los montos de la orden guardada en la base de datos',
            }
          }

          // mark order as paid
          const orderUpdate = await ctx.prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              status: 'PAID',
              transactionId: paypalOrder.id
            },
            include: {
              items: true
            }
          })

          const itemIds = orderUpdate.items.map(item => ({id: item.productId, amount: item.amount }))
        
          // we decrement stock by the units sold
          const promises = itemIds.map(({id, amount}) => {
            return dbMangas.decrementStock(id, amount)
          })

          await Promise.all(promises)

          return {
            message: 'El pago ha sido confirmado como pagado',
            ok: true,
            error: null,
          }
        
        } catch (error) {
          console.error(error)
          return {
            message: 'El pago no pudo ser confirmado',
            ok: false,
            error: null,
          }
        }
      }
    })

  },
})
