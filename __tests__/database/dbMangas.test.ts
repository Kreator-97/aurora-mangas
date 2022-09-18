import { expect } from '@jest/globals'
import prisma from '../../lib/prisma'

import {
  calcCartTotal,
  decrementStock,
  getAllMangas,
  getAllMangasPublished,
  getMangaById,
  getMangaBySerieSlugAndNumber,
  searchMangas
} from '../../database/dbMangas'

describe('tests on dbManga file', () => {
  interface Item {
    productId: string;
    amount   : number;
  }
  
  test('getAllMangas should to return an array of mangas', async () => {
    const mangas = await getAllMangas()

    expect(mangas instanceof Array).toBe(true)
    expect(mangas[0]).toMatchObject({
      title: expect.any(String),
      number: expect.any(String),
      id: expect.any(String),
      serie: expect.any(Object),
    })
  })

  test('getAllMangasPublished should to return an pagination object with mangas published', async () => {
    const mangas = await getAllMangasPublished()
    expect(mangas).toMatchObject({
      mangas: expect.any( Array ),
      page: expect.any( Number ),
      total: expect.any( Number ),
      totalPages: expect.any( Number ),
    })
  })
  
  test('getAllMangasPublished should return the first page when page argument is greater than total pages', async () => {
    const mangas = await getAllMangasPublished(4, 40)
    // page 40 does not exist
    
    expect(mangas).toMatchObject({
      mangas: expect.any( Array ),
      page: 1,
      total: expect.any( Number ),
      totalPages: expect.any( Number ),
    })
  })

  test('getMangaBySerieSlugAndNumber should to return a manga', async () => {
    const mangas = await getMangaBySerieSlugAndNumber('one-punch-man', '1')

    expect(mangas).toMatchObject({
      title: expect.any(String),
      number: expect.any(String),
      id: expect.any(String),
      serie: expect.any(Object),
    })
  })

  test('getMangaBySerieSlugAndNumber should to return null when manga does not exist', async () => {
    // serie dragon ball does not exist
    const mangas = await getMangaBySerieSlugAndNumber('dragon-ball', '1')

    expect(mangas).toBe(null)
  })

  test('search manga should to return an empty array when query is empty', async () => {
    const result = await searchMangas('')
    expect(result).toEqual([])
  })
  
  test('search manga should to return the results, but only published mangas', async () => {
    const result = await searchMangas('one punch')

    expect(result.length > 0).toBe(true)

    result.forEach((manga) => {
      // timestamp for all mangas published should to be less than today
      expect(new Date(manga.published).getTime() < Date.now()).toBe(true)
    })
  })

  test('getMangaById should to get a manga by id', async() => {
    const m = await prisma.manga.findFirst()

    const manga = await getMangaById(m?.id || '')
    expect(manga).toMatchObject({
      title: expect.any(String),
      number: expect.any(String),
      id: expect.any(String),
      serie: expect.any(Object),
    })
  })

  test('calcCartTotal should to calc and return the same total', async () => {
    
  
    const m = await prisma.manga.findFirst()

    const items: Item[] = [
      { productId: m?.id || '', amount: 3 }
    ]
    const total = await calcCartTotal(items, m ? m.price * 3 : 0)
    expect(total).toBe(m!.price * 3)
  })

  test('calcCartTotal should to return a message when items passed was not valid', async () => {

    const items: Item[] = [
      {productId: '123', amount: 1}
    ]
    const total = await calcCartTotal(items, 0)
    expect(total).toBe('No hay items válidos')
  })

  test('calcCartTotal should to return a message when total computed not match with total expected argument', async () => {
    const mangas = await prisma.manga.findMany({ where: {}, take: 3 })

    const items: Item[] = mangas.map((manga) => {
      return {
        amount: 1,
        productId: manga.id
      }
    })

    const total = await calcCartTotal(items, 0)
    // total expected is 0

    expect(total).toBe('El total esperado no coincide con el total calculado')
  })

  test('decrementStock should decrement the manga stock', async () => {
    // create find a serie, create manga, decrement manga stock, and delete manga
    const serie = await prisma.serie.findFirst()

    const manga = {
      imgURL: 'image.png',
      number: '1',
      price: 99,
      published: '2022/01/01',
      stock: 20,
      serieId: serie!.id,
      title: '123'
    }

    const newManga = await prisma.manga.create({
      data: manga
    })

    await decrementStock(newManga.id, 5)

    const mangaUpdated = await prisma.manga.findUnique({where: { id: newManga.id }})

    expect( mangaUpdated?.stock).toBe(15)
    
    await prisma.manga.delete({where: { id: newManga.id }})
  })
})
