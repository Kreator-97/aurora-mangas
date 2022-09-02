import prisma from '../lib/prisma'

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


export const getAllSlugs = async () => {
  const slugs = await prisma.serie.findMany({select: { slug: true }})
  return slugs
}

export const getSerieBySlug = async (slug:string) => {
  const serie = await prisma.serie.findUnique({
    where: { slug },
    include: {
      author: true,
      volumes: {
        orderBy: {
          published: 'desc',
        },
        include: {
          serie: true,
        }
      } 
    }
  })
  return serie
}

export const searchSeries = async (query:string) => {
  if (query === '') return []

  const results = await prisma.serie.findMany({
    where: {
      name: {
        contains: query
      }
    },
  })

  return results
}
