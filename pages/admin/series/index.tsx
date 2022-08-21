import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { dbUsers } from '../../../database'
import { Manga } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { Table } from '../../../components'

interface Props {
  products: Manga[]
}

import { series as products } from '../../../database/seed'

const AdminProductPage: NextPage<Props> = ({}) => {
  return (
    <AppLayout title="Series | Admin" maxWidth='lg'>
      <div className='flex justify-between items-center py-4'>
        <div className='w-36'></div>
        <h1 className='title'>Series</h1>
        <Link href='/admin/series/create'>
          <button className='btn bg-accent'>Agregar serie</button>
        </Link>
      </div>
      {
        products.length === 0 
          ? (
            <h2 className='text-lg text-center'>No existen datos de Series</h2>
          )
          : (
            <Table
              columns={['Id', 'Nombre', 'Autor', 'Generos']}
            >
              {
                products.map((p) => {
                  return (
                    <tr>
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

  return {
    props: {
      products: [],
    }
  }
}
