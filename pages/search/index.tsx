import { GetServerSideProps, NextPage } from 'next'
import { AppLayout } from '../../layouts'
import { Manga, Serie } from '../../interfaces'
import { dbMangas, dbSeries } from '../../database'
import { CardSerie, SliderMangas} from '../../components'

interface Props {
  results: {
    series: Serie[],
    mangas: Manga[]
    total: number,
  },
  query: string;
}

const SearchPage: NextPage<Props> = ({results, query}) => {
  const { total, series, mangas } = results
  const title = `Resultados para "${query}"`

  return (
    <AppLayout title={title} >
      <h1 className='title'>{title}</h1>
      <div className='mb-4'>
        {
          total === 0 && (
            <h2 className='text-center text-lg'>No hay resultados para esta búsqueda</h2>
          )
        }
        {
          series.length > 0 && (
            <section className='flex flex-col items-center'>
              <h2 className='text-center text-xl'>Series</h2>
              {
                series.map((serie) => {
                  return (
                    <CardSerie key={serie.id} serie={serie}/>
                  )
                })
              }
            </section>
          )
        }
        {
          mangas.length > 0 && (
            <SliderMangas mangas={mangas}/>
          )
        }
      </div>
    </AppLayout>
  )
}

export default SearchPage 

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const q = ctx.query.q?.toString()

  const [mangaResults, serieResults ] = await Promise.all([
    await dbMangas.searchMangas(q?.includes('no.') ? q : ''),
    await dbSeries.searchSeriesByName(q || ''),
  ])

  return {
    props: {
      query: q,
      results: {
        series: serieResults,
        mangas: mangaResults,
        total: serieResults.length + mangaResults.length
      }
    }
  }
}

