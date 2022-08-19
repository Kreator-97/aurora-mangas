import type { NextPage } from 'next'

import { CardGrid, CardManga, Pagination } from '../components'
import { AppLayout } from '../layouts'
import { series } from '../database/seed'

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
