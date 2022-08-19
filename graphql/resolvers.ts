import { PrismaClient } from '@prisma/client'

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
    }
  },
  Mutation: {
    createSerie: async (root:any, args:any ) => {
      const { genre, imgURL, finished, name, sinopsis,periodicy, author } = args.serie

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
    }
  }
}
