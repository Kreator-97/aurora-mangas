import { Manga, Serie } from '@prisma/client'
import prisma from '../lib/prisma'

export const getAllMangas = async () => {
  const mangas = await prisma.manga.findMany({
    orderBy: {
      published: 'desc'
    },
    include: { serie: true }
  })

  return mangas
}

export interface MangasWithPagination {
  mangas:(Manga & { serie: Serie })[]
  total: number;
  totalPages: number;
  page: number
}

export const getAllMangasPublished = async (limit=12, page=1):Promise<MangasWithPagination> => {
  const mangas = await prisma.manga.findMany({
    orderBy: {
      published: 'desc'
    },
    include: { serie: true },
  })

  const filteredMangas = mangas.filter((manga) => {
    const publishedDate = new Date(manga.published)
    return publishedDate.getTime() < Date.now()
  })

  const total = filteredMangas.length
  const totalPages = Math.ceil(total / limit)

  const offset = page > totalPages ? 0 : (page-1) * limit

  return {
    mangas: filteredMangas.splice(offset, limit),
    total,
    totalPages,
    page: page > totalPages ? 1 : page,
  }
}

export const getMangaBySerieAndNumber = async (serieName: string, number: string ) => {
  const manga = await prisma.manga.findFirst({ where: {
    serie: {slug: serieName}, AND: { number }
  },
  include: {
    serie: {
      include: { author: true }
    },
  }})

  return manga
}

export const searchMangas = async (query:string) => {

  if (query === '') return []

  const results = await prisma.manga.findMany({
    where: {
      title: {
        contains: query
      }
      
    },
    orderBy: {
      title: 'asc'
    },
    include: {
      serie: true,
    }
  })

  const filteredMangas = results.filter((manga) => {
    const publishedDate = new Date(manga.published)
    return publishedDate.getTime() < Date.now()
  })

  return filteredMangas
}

export const getMangaById = async (id:string) => {
  const manga = await prisma.manga.findUnique({where: {id: id}, include: { serie: true }})
  return manga
}

interface Items {
  productId: string;
  amount   : number;
}

export const calcCartTotal = async (items: Items[], expectedTotal: number):Promise<number | string> => {
  const mangas = await Promise.all( items.map( (item) => {
    return prisma.manga.findUnique({ where: { id: item.productId }})
  }))

  const validMangas = ( mangas.filter((manga) => manga !== null) as Manga[])

  if( validMangas.length === 0 ) return 'items in cart are not valid'
  
  const mangaWithAmount = validMangas.map( (manga, i) => {
    return {...manga, amount: items[i].amount}
  })
  
  const total = mangaWithAmount.reduce((acc, manga ) => {
    if ( !manga.price ) return acc
    return (manga.price * manga.amount) + acc
  } ,0)
  
  if( total !== expectedTotal ) {
    console.log('Los montos del total calculado no coinciden con el monto indicado')
    return 'No se pudo completar el pago'
  }
  
  return total
}
