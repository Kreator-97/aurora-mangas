import { getAuthors } from '../../database/dbAuthors'

describe('tests on dbAuthors file', () => {
  test('getAuthors() should to get all authors', async () => {

    const authors = await getAuthors()
    expect(authors instanceof Array).toBe(true)
    expect(authors[0]).toMatchObject({id: expect.any( String), name: expect.any( String ) })
  })
})
