import { PrismaClient } from '@prisma/client'
import { dbUsers } from '../database'
import { suggestSlug } from '../util'

const prisma = new PrismaClient()

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
  }
}
