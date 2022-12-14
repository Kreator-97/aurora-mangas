import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { dbSeries, dbUsers } from '../../../database'
import { Serie } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { Table } from '../../../components'

interface Props {
  series: Serie[]
}

const AdminProductPage: NextPage<Props> = ({series}) => {
  return (
    <AppLayout title="Series | Admin" maxWidth='lg'>
      <div className='px-2'>
        <div className='flex justify-between items-center py-4'>
          <div className='w-36'></div>
          <h1 className='title'>Series</h1>
          <Link href='/admin/series/create'>
            <button className='btn bg-accent text-sm'>Agregar serie</button>
          </Link>
        </div>
        {
          series.length === 0 
            ? (
              <h2 className='text-lg text-center'>No existen datos de Series</h2>
            )
            : (
              <Table
                columns={['Id', 'Nombre', 'Autor', 'Generos']}
              >
                {
                  series.map((p) => {
                    return (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.author.name}</td>
                        <td>{p.genre}</td>
                      </tr>
                    )
                  })
                }
              </Table>
            )
        }
      </div>
    </AppLayout>
  )
}

export default AdminProductPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const isValid = await dbUsers.validateRole(session?.user.id || '', ['ADMIN'])
  
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
