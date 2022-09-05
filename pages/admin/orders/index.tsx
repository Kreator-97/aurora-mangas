import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

import { dbOrders, dbUsers } from '../../../database'
import { AppLayout } from '../../../layouts'
import { Order } from '../../../interfaces'
import { Table } from '../../../components'

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
            <h2 className='text-center text-xl '>No hay pedidos realizados</h2>
          )
          : (
            <Table columns={['Orden ID', 'Comprador', 'Cant. Artículos','Fecha', 'Estado', 'Acción' ]}>
              {
                orders.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td>
                        { order.id }
                      </td>
                      <td>{order.user.fullname}</td>
                      <td>{order.items.length}</td>
                      <td>{new Date(order.date).toDateString() }</td>
                      <td>{order.status}</td>
                      <td>
                        <Link href={`/admin/orders/${order.id}`}>
                          <a className='btn bg-accent'>Ver orden</a>
                        </Link>
                      </td>
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

  const orders = await dbOrders.getAllOrders()

  return {
    props: {
      orders,
    }
  }
}
