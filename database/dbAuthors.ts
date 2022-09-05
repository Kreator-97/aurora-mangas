import prisma from '../lib/prisma' 

export const getAuthors = async () => {
  const authors = await prisma.author.findMany()
  return authors
}
