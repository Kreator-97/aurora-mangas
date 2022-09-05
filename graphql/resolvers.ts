import prisma from '../lib/prisma'
import { dbUsers } from '../database'
import { User } from '../interfaces'
import { suggestSlug } from '../util'
import { calcCartTotal } from '../database/dbMangas'
import fetch from 'cross-fetch'
import { getPaypalBearerToken } from '../util/paypal'
import { Session } from 'next-auth'

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
    users: async() => {
      const users = await prisma.user.findMany({
        include: {
          address: true
        }
      })
      return users.map((user) => ({...user, password: null}))
    },
    orders: async () => {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            }
          }, 
          user: true
        }
      })
      return orders
    },
    ordersByUser: async (parent:any, args: any) => {
      const { userId } = args
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
      if( orders.length === 0 ) return null
      return orders
    }
  },
  Mutation: {
    createSerie: async (root:any, args:any ) => {
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
    createAuthor: async(parent:any, args:any) => {
      const { name } = args
      try {
        const result = await prisma.author.create({ data: { name }, include: { serie: true }})
        return result
      } catch (error) {
        return null
      }
    },
    createManga: async(parent: any, args: any) => {
      const { serieId, number, price, imgURL, published, title } = args

      const isValidDate = new Date(published)
      if ( isValidDate.toString() === 'Invalid Date') {
        return {
          message: 'Manga was not created',
          error: 'Date is not valid',
          ok: false,
        }
      }

      const mangaInput = {
        imgURL, number, price, published, title
      }

      const serie = await prisma.serie.update({
        where: {
          id: serieId
        },
        data: {
          volumes: {
            create: mangaInput
          }
        }, include: { author: true }})

      return {
        ok: true,
        message: 'Manga agregado a la serie ' + serie.name
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
    async updateManga(parent: any, args: any) {
      const { mangaId } = args
      const { serieId, number, price, imgURL, published, title } = args.manga

      try {
        const updated = await prisma.manga.update({
          where: {
            id: mangaId,
          },
          data: {
            number, price, published, imgURL, title, serieId
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
    async createAndUpdateDirection(root:any, args:any) {
      // este resolver se encarga tanto de crear como de actualizar una dirección
      const userId = args.userId
      const address = args.address

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { address: true }
      })

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

        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: 'PAID',
            transactionId: paypalOrder.id
          }
        })
        
        if( Number(paypalOrder.purchase_units[0].amount.value) !== order.total ) {
          return {
            message: 'No se pudo confirmar el pago',
            ok: false,
            error: 'Los montos de paypal no coinciden con los montos de la orden guardada en la base de datos',
          }
        }

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
  }
}
