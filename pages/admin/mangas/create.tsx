import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { AppLayout } from '../../../layouts'
import { CREATE_MANGA } from '../../../graphql/client'
import { dbSeries, dbUsers } from '../../../database'
import { Serie } from '../../../interfaces'
import { FormCreateManga } from '../../../components'

interface Props {
  series: Serie[];
}

const AdminCreateManga:NextPage<Props> = ({series}) => {
  const [ createManga ] = useMutation(CREATE_MANGA)

  const onSave = async (formState:FormCreateManga) => {
    console.log('submit')
    const { imgURL, month, number, price, serie, title, year } = formState
    const monthPrefixed = Number(month) < 10 ? `0${Number(month)}` : month
    const published = `${year}/${monthPrefixed}/01`

    try {
      const { data } = await createManga({variables: {
        serieId: serie, title, number, imgURL, price: Number(price), published
      }})
      toast.success(data.createManga.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppLayout title="Crear manga" maxWidth='md'>
      <h1 className='title'>Agregar nuevo manga</h1>
      <FormCreateManga series={series} onSubmit={onSave}/>
    </AppLayout>
  )
}

export default AdminCreateManga

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

  const series = await dbSeries.getSeries()

  return {
    props: {
      series,
    }
  }
}
