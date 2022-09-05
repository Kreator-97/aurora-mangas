import prisma from '../lib/prisma'

export const getSoldUnitsByMangaId = async (mangaId:string) => {
  const soldUnits = await prisma.item.groupBy({
    by: ['productId'],
    _sum: {
      amount: true
    },
    where: { productId: mangaId }
  })
  return soldUnits[0]._sum.amount
}
