import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { dbAuthors, dbUsers } from '../../../database'
import { Author } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { Table } from '../../../components'

interface Props {
  authors: Author[]
}

const AdminAuthorPage: NextPage<Props> = ({authors}) => {
  return (
    <AppLayout title="Series | Admin" maxWidth='lg'>
      <div className='px-2'>
        <div className='flex justify-between items-center py-4'>
          <div className='w-36'></div>
          <h1 className='title'>Autores</h1>
          <Link href='/admin/authors/create'>
            <button className='btn bg-accent text-sm'>Agregar autor</button>
          </Link>
        </div>
        {
          authors.length === 0 
            ? (
              <h2 className='text-lg text-center'>No existen datos de Autores</h2>
            )
            : (
              <Table
                columns={['Id', 'Nombre']}
              >
                {
                  authors.map((p) => {
                    return (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
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

export default AdminAuthorPage

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

  const authors = await dbAuthors.getAuthors()

  return {
    props: {
      authors,
    }
  }
}
