import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { AppLayout } from '../../../layouts'
import { UPDATE_MANGA } from '../../../graphql/client'
import { dbMangas, dbSeries, dbUsers } from '../../../database'
import { Manga, Serie } from '../../../interfaces'
import { FormCreateManga } from '../../../components'

interface Props {
  series: Serie[];
  manga: Manga;
}

const AdminUpdateManga:NextPage<Props> = ({series, manga}) => {
  const [ updateManga ] = useMutation(UPDATE_MANGA)

  const onSave = async (formState:FormCreateManga) => {
    const { imgURL, month, number, price, serie, title, year } = formState
    const monthPrefixed = Number(month) < 10 ? `0${Number(month)}` : month
    const published = `${year}/${monthPrefixed}/01`

    try {
      const { data } = await updateManga({
        variables: {
          mangaId: manga.id,
          manga: {
            serieId: serie, title, number, imgURL, price: Number(price), published
          }
        }
      })
      
      const message = data.updateManga.message

      if( !data.updateManga.ok ) {
        throw new Error(message)
      }
      
      toast.success(message)
    } catch (error) {
      toast.error((error as {message: string}).message)
      console.log(error)
    }
  }

  return (
    <AppLayout title="Actualizar manga" maxWidth='md'>
      <div className='px-2'>
        <h1 className='title'>Actualizar manga</h1>
        <FormCreateManga series={series} onSubmit={onSave} manga={manga} resetOnSubmit={false}/>
      </div>
    </AppLayout>
  )
}

export default AdminUpdateManga

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const isValid = dbUsers.validateRole(session?.user.id || '', ['ADMIN'])
  if( !isValid ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const id = ctx.query.id?.toString()

  const [series, manga] = await Promise.all([
    await dbSeries.getSeries(),
    await dbMangas.getMangaById(id || ''),
  ])

  return {
    props: {
      series,
      manga
    }
  }
}
