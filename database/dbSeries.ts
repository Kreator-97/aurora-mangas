import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export const getSeries = async () => {
  const series = await prisma.serie.findMany({include: {
    author: true
  }})
  return series
}

export const getNewReleaseSeries = async () => {
  const series = await prisma.serie.findMany({
    where: {
      isNewRelease: true,
    },  
    include: {
      author: true,
    }
  })

  return series
}
