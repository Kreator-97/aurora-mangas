import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllMangas = async () => {
  const mangas = await prisma.manga.findMany({include: { serie: true }})
  return mangas
}

