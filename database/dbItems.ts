import prisma from '../lib/prisma'

export const getSoldUnitsByMangaId = async (mangaId:string):Promise<number | null > => {
  const soldUnits = await prisma.item.groupBy({
    by: ['productId'],
    _sum: {
      amount: true
    },
    where: { productId: mangaId }
  })
  if( soldUnits.length === 0) return null
  return soldUnits[0]._sum.amount
}
