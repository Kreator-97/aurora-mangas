import type { GetServerSideProps, NextPage } from 'next'

import { CardGrid, CardManga, Pagination } from '../components'
import { dbSeries } from '../database'
import { Serie } from '../interfaces'
import { AppLayout } from '../layouts'

interface Props {
  series: Serie[]
}

const Home: NextPage<Props> = ({series}) => {

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const series = await dbSeries.getSeries()

  return {
    props: {
      series,
    }
  }
}
