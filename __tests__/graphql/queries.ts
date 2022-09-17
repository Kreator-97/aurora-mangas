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

  test('test on query all users', async () => {
    // TODO: this query must to be private
    // authentication cookie is necessary

    const res = await testEndpoint(`{
      users {
        id
        createdAt
        email
        fullname
        imgURL
        password
        role
        updatedAt
        address {
          city
          col
          cp
          number
          state
        }
      }
    }`)

    const users = res?.data.users

    expect(users instanceof Array).toBe(true)
    expect(users.length).toBe(2)
    expect(users[0]).toMatchObject({
      id        : expect.any( String ),
      createdAt : expect.any( String ),
      email     : expect.any( String ),
      fullname  : expect.any( String ),
      role      : expect.any( String ),
      updatedAt : expect.any( String ),
      password  : null,
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

  test('query orders by a userId', async () => {
    // TODO: this query must to be private
    // authentication cookie is necessary

    await prisma.order.create({
      data: {
        total: 99,
        userId: userTest?.id || '',
      }
    })

    const res = await testEndpoint(`
      query order($userId: String!) {
        ordersByUser( userId: $userId) {
          items {
            product {
              price
            }
            amount
          }
          total
          user {
            fullname
            id
          }
        }
      }
    `, {
      variables: {
        userId: userTest!.id
      }
    })

    const orders = res.data.ordersByUser

    expect(orders instanceof Array).toBe(true)
    expect(orders.length).toBe(1)
    expect(orders[0]).toMatchObject({
      items: expect.any(Array),
      total: expect.any(Number),
      user: expect.any(Object),
    })
  })

  test('test on query volumes', async () => {
    const res = await testEndpoint(`
    {
      volumes {
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

    const volumes = res.data.volumes
    expect( volumes instanceof Array ).toBe(true)
    expect( volumes.length).toBe(12)
    expect( volumes[0] ).toMatchObject({
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
