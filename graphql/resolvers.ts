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
    }
  },
  Mutation: {
    createSerie: async (root:any, args:any ) => {
      const { genre, imgURL, finished, name, unitPrice, sinopsis,periodicy, author } = args.serie

      try {
        const result = await prisma.serie.create({data: {
          finished,
          genre,
          imgURL,
          name,
          sinopsis,
          unitPrice,
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
    }
  }
}
