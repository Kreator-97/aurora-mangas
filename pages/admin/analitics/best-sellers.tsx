import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { Table } from '../../../components'
import { dbMangas, dbUsers } from '../../../database'
import { Manga } from '../../../interfaces'
import { AppLayout } from '../../../layouts'

interface Props {
  bestSellers: { product: Manga, soldUnits: number }[]
}

const BestSellersPage:NextPage<Props> = ({bestSellers}) => {
  return (
    <AppLayout title="Más vendidos">
      <h1 className='title'>Productos más vendidos</h1>

      <Table columns={['Id', 'Título', 'Unidades vendidas', 'Acción']}>
        {
          bestSellers.map(({product, soldUnits}) => {
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{soldUnits}</td>
                <td>
                  <Link href={`/admin/mangas/${product.id}`}>
                    <a className='btn bg-accent'>Ver producto</a>
                  </Link>
                </td>
              </tr>
            )
          })
        }
      </Table>
    </AppLayout>
  )
}

export default BestSellersPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const session = await getSession(ctx)

  if( !session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const isValid = await dbUsers.validateRole(session.user.id, ['ADMIN'])
  if( !isValid ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const mangas = await dbMangas.getBestSellersMangas()

  return {
    props: {
      bestSellers: mangas
    }
  }
}
