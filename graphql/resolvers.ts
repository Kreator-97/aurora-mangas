import prisma from '../lib/prisma'
import { dbUsers } from '../database'
import { User } from '../interfaces'
import { suggestSlug } from '../util'
import { calcCartTotal } from '../database/dbMangas'

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
      const users = await prisma.user.findMany()
      return users
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

      if( !user ) return null

      const total = await calcCartTotal(items, args.total)
      if( typeof total === 'string' ) return total

      try {
        await prisma.order.create({
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

        return 'Orden de pago creada'
      } catch (error) {
        console.log(error)
        return 'error'
      }
    }
  }
}
