import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export const getAuthors = async () => {
  const authors = await prisma.author.findMany()
  return authors
}
