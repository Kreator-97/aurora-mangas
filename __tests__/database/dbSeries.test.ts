import { expect } from '@jest/globals'
import prisma from '../../lib/prisma'
import { getSeries, getAllSlugs, getNewReleaseSeries, getSerieBySlug, searchSeriesByName } from '../../database/dbSeries'

describe('tests on dbSeries file', () => {

  test('getSeries should to get all series', async () => {

    const series = await getSeries()
    expect(series instanceof Array).toBe(true)
    expect(series[0]).toMatchObject({
      id: expect.any(String),
      author: expect.any( Object ),
      finished: expect.any( Boolean ),
      genre: expect.any( String ),
      imgURL: expect.any( String ),
      name: expect.any( String ),
      periodicy: expect.any( String ),
      sinopsis: expect.any( String ),
      isNewRelease: expect.any( Boolean ),
      slug: expect.any( String ),
      unitPrice: expect.any( Number ),
      totalVolumes: expect.any( Number ),
    })
  })

  test('getAllSlugs should to return an array of slugs', async () => {
    const slugs = await getAllSlugs()
    expect(slugs instanceof Array).toBe(true)
    expect(slugs.length > 0).toBe(true)
    expect( slugs[0] ).toMatchObject({
      slug: expect.any(String)
    })
  })

  test('getNewReleaseSeries should to return only new release series', async () => {
    const series = await getNewReleaseSeries()
    const notNewSerie = await prisma.serie.findFirst({ where: {
      isNewRelease: false
    }})

    expect(series).not.toContain(notNewSerie)
  })

  test('getSerieBySlug should to return a serie', async () => {
    const slugs = await getAllSlugs()

    const serie = await getSerieBySlug(slugs[0].slug)
    expect(serie ).toMatchObject({
      name: expect.any(String),
      id: expect.any(String),
      slug: slugs[0].slug,
    })

  })
  test('searchSerie should to return an empty array if query is empty', async () => {
    const result = await searchSeriesByName('')
    expect(result).toEqual([])
  })

  test('searchSerieByName should to return the respective series if is found', async () => {
    const series = await searchSeriesByName('one')
    // this find => one piece, one punch man

    expect(series instanceof Array).toBe(true)
    expect(series.length).toBe(2)
    expect(series[0]).toMatchObject({
      name: expect.any(String),
      id: expect.any(String),
      slug: series[0].slug,
    })
  })
})

