import { expect } from '@jest/globals'
import { User } from '@prisma/client'
import prisma from '../../lib/prisma'
import { Serie } from '../../interfaces'
import { testEndpoint } from '../../lib/graphqlTestCall'

describe('test graphql queries', () => {
  let userTest: User | null = null
  beforeAll(async () => {
    userTest = await prisma.user.findUnique({
      where: {
        email: 'user@user.com'
      }
    })
  })

  test('test on query authors', async () => {
    const res = await testEndpoint(`
      query {
        authors {
          id
          name
          series {
            name
            id
          }
        }
      }
    `)

    const data = res?.data
    expect(data.authors instanceof Array).toBe(true)
    expect(data.authors.length).toBe(3)
  })

  test('test on query series', async () => {
    const res = await testEndpoint<{series: Serie[]}>(`
      {
        series {
          id
          author {
            id
            name
          }
          finished
          genre
          imgURL
          isNewRelease
          name
          periodicy
          sinopsis
          slug
        }
      }
    `)

    const data = res?.data

    expect(data.series.length).toBe(3)
    expect(data.series[0]).toMatchObject({
      id          : expect.any( String ),
      author      : expect.any( Object ),
      finished    : expect.any( Boolean ),
      genre       : expect.any( String ),
      imgURL      : expect.any( String ),
      isNewRelease: expect.any( Boolean ),
      name        : expect.any( String ),
      periodicy   : expect.any( String ),
      slug        : expect.any( String ),
    })
  })

  test('test on query mangas', async () => {
    const res = await testEndpoint(`
    {
      mangas {
        price
        id
        serie {
          name
          id
        }
        number
        imgURL
        published
        title
      }
    }
    `)

    const mangas = res.data.mangas
    expect( mangas instanceof Array ).toBe(true)
    expect( mangas.length).toBe(12)
    expect( mangas[0] ).toMatchObject({
      price: expect.any( Number ),
      id: expect.any( String ),
      serie: expect.any( Object ),
      number: expect.any( String ),
      imgURL: expect.any( String ),
      published: expect.any( String ),
      title: expect.any( String ),
    })
  })

  afterAll( async () => {
    await prisma.order.deleteMany({
      where: {
        userId: userTest?.id
      }
    })
  })
})
