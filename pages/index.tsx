import type { NextPage } from 'next'

import { CardGrid, CardManga, Pagination } from '../components'
import { Serie } from '../interfaces'
import { AppLayout } from '../layouts'

export const series:Serie[] = [
  {
    name: 'Inuyasha',
    imgURL: '/images/mangas/inuyasha.jpeg',
    periodicy: 'bimestral',
    volumes: [],
    genre: ['adventure', 'romance'],
    demography: ['shonnen', 'seinen'],
    finished: true,
    unitPrice: 136,
    sipnosis: 'InuYasha es una serie de manga escrita e ilustrada en el año 1996 por Rumiko Takahashi. La serie narra las aventuras de un Hanyo llamado Inuyasha, que en compañía de Kagome Higurashi, una joven del siglo XX y sus amigos, están en la búsqueda de los fragmentos de la Perla de Shikon en la era Sengoku. ',
    author: {
      name: 'Rumiko takahashi',
      birthDate: '23/12/1967'
    }
  },
  {
    name: 'One Piece',
    imgURL: '/images/mangas/one-piece.jpeg',
    periodicy: 'mensual',
    volumes: [],
    genre: ['adventure', 'action'],
    demography: ['shonnen'],
    finished: false,
    unitPrice: 99,
    author: {
      name: 'Eichiro Oda',
      birthDate: '23/12/1987'
    }
  },
]

const Home: NextPage = () => {
  return (
    <AppLayout title='Aurora Mangas | Página de inicio'>
      <h1 className='title'>
        Series nuevas
      </h1>
      <CardGrid series={ series } />
      <h1 className='title'>
        Últimos lanzamientos 
      </h1>

      <CardGrid gridCols='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' >
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
        <CardManga />
      </CardGrid>
      <Pagination totalPages={20}/>
    </AppLayout>
  )
}

export default Home
