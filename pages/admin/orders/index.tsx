import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbUsers } from '../../../database'

import { AppLayout } from '../../../layouts'
import { Order } from '../../../interfaces'

interface Props {
  orders: Order[]
}

const OrdersPage: NextPage<Props> = ({orders}) => {
  return (
    <AppLayout title="Pedidos realizados">
      <h1 className='text-2xl text-center py-4'>Ordenes</h1>
      {
        orders.length === 0
          ? (
            <h2 className='title'>No hay pedidos realizados</h2>
          )
          : (
            <table>
              <thead>
                <th>Orden ID</th>
                <th>Comprador</th>
                <th>Comprador ID</th>
                <th>Fecha</th>
              </thead>
            </table>
          )
      }

    </AppLayout>
  )
}

export default OrdersPage

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
      orders: [],
    }
  }
}
