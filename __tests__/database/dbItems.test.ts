import { getSoldUnitsByMangaId } from '../../database/dbItems'
import prisma from '../../lib/prisma'

describe('tests on dbItems files', () => {

  test('getSoldUnitsByMangaId should to return null when manga with id does not exist', async () => {
    const soldUnits = await getSoldUnitsByMangaId('123abc')
    expect(soldUnits).toBe(null)
  })

  test('getSoldUnitsByMangaId should to return sold units for a manga', async () => {
    // fist we use a user test
    // this user is created when db is seeding
    const user = await prisma.user.findUnique({
      where: { email: 'user@user.com' }
    })

    // find any manga in db
    const manga = await prisma.manga.findFirst()

    // first create an order
    const order = await prisma.order.create({
      data: {
        total: manga!.price * 5,
        userId: user?.id || '',
        items: {
          create: {
            amount: 5,
            productId: manga!.id
          }
        }
      },
      include: { items: true }
    })

    // get sold units recently
    const soldUnits = await getSoldUnitsByMangaId(manga!.id)

    expect(typeof soldUnits).toBe('number')
    expect(soldUnits).toBe(5)

    // we delete all items
    await prisma.item.deleteMany()

    // finally also delete all orders
    await prisma.order.delete({
      where: {
        id: order.id
      }
    })
  })
})
