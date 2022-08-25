import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { CardGrid, CardManga, Pagination } from '../components'
import { dbMangas, dbSeries } from '../database'
import { Manga, Serie } from '../interfaces'
import { AppLayout } from '../layouts'

interface Props {
  series: Serie[]
  mangasInfo: {
    mangas: Manga[],
    total: number;
    totalPages: number;
    page: number
  }
}

const Home: NextPage<Props> = ({series, mangasInfo}) => {
  const { mangas, totalPages, page } = mangasInfo
  const router = useRouter()

  const onPageChange = (page:number) => {
    router.push(`/?page=${page}`)
  }

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
        {
          mangas.map((manga) => {
            return (
              <CardManga manga={manga} key={manga.id}/>
            )
          })
        }
      </CardGrid>
      <Pagination totalPages={totalPages} initialPage={page} onPageChange={onPageChange} />
    </AppLayout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const page = ctx.query.page?.toString()

  const [ series, mangas ] = await Promise.all([
    await dbSeries.getNewReleaseSeries(),
    await dbMangas.getAllMangasPublished(12, Number(page || 1)),
  ])

  return {
    props: {
      series,
      mangasInfo: mangas
    }
  }
}
