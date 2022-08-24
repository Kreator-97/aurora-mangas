import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllMangas = async () => {
  const mangas = await prisma.manga.findMany({
    orderBy: {
      published: 'desc'
    },
    include: { serie: true }
  })

  return mangas
}

export const getAllMangasPublished = async () => {
  const mangas = await prisma.manga.findMany({
    orderBy: {
      published: 'desc'
    },
    include: { serie: true }
  })

  const filteredMangas = mangas.filter((manga) => {
    const publishedDate = new Date(manga.published)
    return publishedDate.getTime() < Date.now()
  })

  return filteredMangas
}

export const getMangaBySerieAndNumber = async (serieName: string, number: string ) => {
  const manga = await prisma.manga.findFirst({ where: {
    serie: {slug: serieName}, AND: { number }
  },
  include: {
    serie: {
      include: { author: true }
    },
  }})

  return manga
}
