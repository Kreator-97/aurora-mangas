import { Session } from 'next-auth'
import fetch from 'cross-fetch'
import prisma from '../lib/prisma'

import { calcCartTotal } from '../database/dbMangas'
import { dbMangas, dbUsers } from '../database'
import { getPaypalSubscription, getPaypalBearerToken, cancelPaypalSubscription } from '../util/paypal'
import { suggestSlug } from '../util'
import { User } from '../interfaces'

export const resolvers = {
  Query: {
    series: async () => {
      const series = await prisma.serie.findMany({include:{author: true}})
      return series
    },
    authors: async () => {
      const authors = await prisma.author.findMany()
      const newAuthors:any[] = []
      for( let a of authors ) {
        const series = await prisma.serie.findMany({where: { authorId: a.id }})
        newAuthors.push({...a, series})
      }
      return newAuthors
    },
    volumes: async(parent:any, args: any) => {
      const { serieId } = args
      const mangas = await prisma.manga.findMany({
        where: {
          serieId: serieId
        },
        include: {
          serie: true
        }
      })
      return mangas
    },
    users: async(_:any, args:any, ctx: {session: Session}) => {
      if( !ctx.session ) {
        return {
          users: [],
          message: 'token is mandatory',
          error: 'Authentication failed',
          ok: false
        }
      }

      if( ctx.session.user.role !== 'ADMIN' ) {
        return {
          users: [],
          message: 'This user cannot perform this query',
          error: 'Authorization failed',
          ok: false
        }
      }

      try {
        const users = await prisma.user.findMany({
          include: {
            address: true
          }
        })
  
        return {
          users: users.map((user) => ({...user, password: null})),
          message: 'Users found',
          error: null,
          ok: true,
        }
      } catch (error) {
        console.error(error)
        return {
          users: [],
          message: 'Ocurrió un error al realizar la query',
          error,
          ok: false
        }
      }
    },
    ordersByUser: async (parent:any, args: any, ctx: {session:Session}) => {
      if( !ctx.session ) {
        return {
          orders: [],
          message: 'token is mandatory',
          error: 'Authentication failed',
          ok: false
        }
      }
      const { userId } = args

      if( ctx.session.user.id !== userId ) {
        return {
          orders: [],
          message: 'This user cannot get these orders',
          error: 'Authentication failed',
          ok: false
        }
      }

      const orders = await prisma.order.findMany({
        where: {
          userId
        },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      })

      return {
        orders,
        message: 'Orders found',
        error: null,
        ok: true
      }
    }
  },
  Mutation: {
    createSerie: async (root:any, args:any, ctx: {session: Session } ) => {
      if( !ctx.session ) {
        return null
      }
      
      const user = ctx.session.user
      
      if( user.role !== 'ADMIN' ) {
        return null
      }

      const { genre, imgURL, finished, name, sinopsis,periodicy, author } = args.serie

      // we generate a slug automatically
      const slug = suggestSlug(name)
      
      try {
        const result = await prisma.serie.create({data: {
          finished,
          genre,
          imgURL,
          name,
          sinopsis,
          author: {
            connect: {
              id: author
            }
          },
          periodicy,
          slug,
        }, include: { author: true }})
        return result
      } catch (error) {
        console.log(error)
        return null
      }
    },
    createAuthor: async(parent:any, args:any, ctx: {session: Session}) => {
      if( !ctx.session ) {
        return null
      }
      
      const user = ctx.session.user
      
      if( user.role !== 'ADMIN' ) {
        return null
      }

      const { name } = args
      try {
        const result = await prisma.author.create({ data: { name }, include: { serie: true }})
        return result
      } catch (error) {
        return null
      }
    },
    createManga: async(parent: any, args: any, ctx: {session: Session}) => {
      if( !ctx.session ) {
        return {
          message: 'Token not send',
          error: 'Authentication failed',
          ok: false,
        }
      }
      
      const user = ctx.session.user
      
      if( user.role !== 'ADMIN' ) {
        return {
          message: 'This user cannot perform this operation',
          error: 'Authorization failed',
          ok: false,
        }
      }

      const { serieId, number, price, imgURL, published, title } = args

      const isValidDate = new Date(published)
      if ( isValidDate.toString() === 'Invalid Date') {
        return {
          message: 'Manga was not created',
          error: 'Date is not valid',
          ok: false,
        }
      }

      const newManga = await prisma.manga.create({
        data: {
          imgURL,
          number,
          price,
          published,
          stock: 0,
          title,
          serieId,
        }, include: { serie: true }
      })

      return {
        ok: true,
        message: 'Manga agregado a la serie ' + newManga.serie.name
      }
    },
    async createUser(parent: any, args: any) {
      const { fullname, email, password } = args

      try {
        await dbUsers.isEmailAvailible(email)
        const user = await dbUsers.registerUser({email, password, fullname})
        return {
          user: user,
          ok: true,
          message: 'User created successfully',
          error: null,
        }

      } catch(error) {
        console.log(error)
        return {
          user: null,
          ok: false,
          message: (error as string),
          error,
        }
      }
    },
    async updateManga(parent: any, args: any, ctx: {session: Session}) {
      if( !ctx.session ) {
        return {
          message: 'Token not send',
          error: 'Authentication failed',
          ok: false,
        }
      }
      
      const user = ctx.session.user
      
      if( user.role !== 'ADMIN' ) {
        return {
          message: 'This user cannot perform this operation',
          error: 'Authorization failed',
          ok: false,
        }
      }

      const { mangaId } = args
      const { serieId, number, price, imgURL, published, title, stock } = args.manga

      try {
        const updated = await prisma.manga.update({
          where: {
            id: mangaId,
          },
          data: {
            number, price, published, imgURL, title, serieId, stock
          }, include: {
            serie: true,
          }
        })

        return {
          manga: updated,
          ok: true,
          message: 'Actualizado con éxito',
          error: null,
        }
      } catch (error) {
        console.log(error)
        return {
          manga: null,
          ok: false,
          message: 'Ocurrió un error al actualizar',
          error: (error as { message: string }),
        }
      }
    },
    async createOrder(parent: any, args: {items: any[], total: number }, ctx:any) {
      const { items } = args
      const user = ctx?.session?.user as User

      if( !user ) {
        return {
          message: 'No se pudo crear la orden',
          error: 'El usuario no está authenticado',
          ok: false
        } 
      }

      const total = await calcCartTotal(items, args.total)
      if( typeof total === 'string' ) {
        return {
          message: total,
          error: 'El monto calculado no coincide',
          ok: false,
        } 
      }

      try {
        const order = await prisma.order.create({
          data: {
            user: {
              connect: {
                id: user.id
              }
            },
            total,
            items: {
              createMany: {
                data: items.map( i => ({
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
      } catch (error) {
        console.error(error)
        return 'Error al intentar realizar la orden'
      }
    },
    async createAndUpdateDirection(root:any, args:any, ctx: {session: Session}) {
      if( !ctx.session ) {
        return {
          message: 'Token not send',
          error: 'Authentication failed',
          ok: false,
        }
      }

      // este resolver se encarga tanto de crear como de actualizar una dirección
      const userId = args.userId
      const address = args.address

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { address: true }
      })
      if( ctx.session.user.id !== user?.id ) {
        return {
          message: 'This user cannot perform this operation',
          error: 'Authorization failed',
          ok: false
        }
      }
        
      // si la dirección existe entonces realizamos una actualización
      if( user?.address ) {
        try {
          await prisma.address.update({
            where: {
              userId,
            },
            data: {
              city: address.city,
              col: address.col,
              cp: address.cp,
              number: address.number,
              state: address.state
            }
          })
        
          return {
            ok: true,
            message: 'La dirección ha sido actualizada',
            error: null,
          }
        } catch (error) {
          console.error(error)
          return {
            ok: false,
            message: 'No se pudo actualizar la dirección',
            error: null,
          }
        }
      }

      // Aqui realizamos una creación de la dirección del usuario
      try {
        await prisma.address.create({
          data: {
            city: address.city,
            col: address.col,
            cp: address.cp,
            number: address.number,
            state: address.state,
            userId: userId
          }
        })
        
        return {
          ok: true,
          message: 'La dirección ha sido guardada exitosamente',
          error: null
        }
      } catch (error) {
        console.error(error)
        return {
          ok: false,
          message:'Ocurrió un error al intentar guardar la dirección',
          error: null,
        }
      }
    },
    async confirmPaypalOrder(root:any, args:any, ctx:{session:Session} ) {
      const { paypalOrderId, orderId } = args
      
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      })

      if( !order ) {
        return {
          message: `La orden con id "${orderId}" no existe`,
          ok: false,
          error: 'Orden no existe',
        }
      }

      if( ctx.session.user.id !== order.userId ) {
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
        const orderUpdate = await prisma.order.update({
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
    },
    async createSubscription(root: any, args: any, ctx: {session:Session} )
    {
      const { paypalSubscriptionID, serieId } = args

      const { session } = ctx
      if( !session ) {
        return {
          message: 'Este usuario no puede confirmar la suscripción',
          error: null,
          ok: false
        }
      }

      const subscription = await getPaypalSubscription(paypalSubscriptionID)

      if( !subscription || subscription.status !== 'ACTIVE' ) {
        return {
          message: 'La orden no pudo ser confirmada',
          error: null,
          ok: false
        }
      }

      try {
        await prisma.subscription.create({
          data: {
            userId: session.user.id,
            paypalSuscriptionId: subscription.id,
            serieId,
            status: subscription.status,
          }
        })

        return {
          message: 'Se ha creado la suscripción',
          ok: true,
          error: null
        }
        
      } catch (error: any) {
        console.error(error)
        return {
          message: 'Ocurrió un error al intentar realizar la suscripción',
          ok: false,
          error,
        }
      }
    },
    async cancelSubscription(root: any, args: any, ctx: {session: Session}) {
      const { session } = ctx
      if( !session ) {
        return {
          message: 'El usuario no está autenticado',
          ok: false,
          error: null,
        }
      }

      const { subscriptionID } = args

      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionID }
      })

      if( !subscription ) {
        return {
          message: 'No existe una suscripción con el id proporcionado',
          ok: false,
          error: null,
        }
      }

      if( subscription.status === 'CANCELLED' ) {
        return {
          message: 'La suscripción ha sido cancelada previamente',
          ok: false,
          error: null,
        }
      }

      if( subscription.userId !== session.user.id ) {
        return {
          message: 'Este usuario no puede cancelar la suscripción',
          ok: false,
          error: null,
        }
      }

      try {
        const res = await cancelPaypalSubscription(subscription.paypalSuscriptionId)
        if( !res ) {
          return {
            message: 'Error en la petición hacia paypal',
            ok: false,
            error: null,
          }
        }

        await prisma.subscription.update({
          where: { id: subscriptionID },
          data: {
            status: 'CANCELLED',
          }
        })

        return {
          message: 'La suscripción ha sido cancelada',
          ok: true,
          error: null,
        }
      } catch (error) {
        console.error(error)
        return {
          message: 'Ocurrió un error al intentar cancelar la subscripción',
          ok: false,
          error,
        }
      }
    }
  }
}
