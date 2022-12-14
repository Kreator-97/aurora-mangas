import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { dbMangas, dbUsers } from '../../../database'
import { Manga } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { Table } from '../../../components'
import { formatPrice } from '../../../util'

interface Props {
  mangas: Manga[]
}

const AdminMangaPage: NextPage<Props> = ({mangas}) => {

  return (
    <AppLayout title="Series | Admin" maxWidth='lg'>
      <div className='px-2'>
        <div className='flex justify-between items-center py-4'>
          <div className='w-36'></div>
          <h1 className='title'>Mangas</h1>
          <Link href='/admin/mangas/create'>
            <button className='btn bg-accent text-sm'>Agregar manga</button>
          </Link>
        </div>
        {
          mangas.length === 0 
            ? (
              <h2 className='text-lg text-center'>No existen datos de Mangas</h2>
            )
            : (
              <Table
                columns={['Id', 'Nombre', '# Volumen', 'Precio Unitario($)', 'Stock', 'Publicación', 'Editar']}
              >
                {
                  mangas.map((manga) => {
                    return (
                      <tr key={manga.id}>
                        <td>{manga.id}</td>
                        <td>{manga.serie.name}</td>
                        <td>{manga.number}</td>
                        <td>{formatPrice(manga.price)}</td>
                        <td>{manga.stock}</td>
                        <td>{manga.published}</td>
                        <td>
                          <Link href={`/admin/mangas/update?id=${manga.id}`}>
                            <a className='btn bg-accent'>Editar 📝</a>
                          </Link>
                        </td>
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

export default AdminMangaPage

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

  const mangas = await dbMangas.getAllMangas()

  return {
    props: {
      mangas,
    }
  }
}
