import type { NextPage } from 'next'

import { CardGrid, CardManga, Pagination } from '../components'
import { Serie } from '../interfaces'
import { AppLayout } from '../layouts'

const series:Serie[] = [
  {
    name: 'Inuyasha',
    imgURL: '/images/mangas/inuyasha.jpeg',
    periodicy: 'bimestral',
    volumes: [],
    genre: ['adventure', 'romance'],
    demography: ['shonnen', 'seinen'],
    finished: true,
  },
  {
    name: 'One Piece',
    imgURL: '/images/mangas/one-piece.jpeg',
    periodicy: 'mensual',
    volumes: [],
    genre: ['adventure', 'action'],
    demography: ['shonnen'],
    finished: false,
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
      <Pagination totalPages={4}/>
    </AppLayout>
  )
}

export default Home
