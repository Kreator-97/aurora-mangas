import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { AppLayout } from '../../../layouts'
import { dbOrders } from '../../../database'
import { Order } from '../../../interfaces'
import { OrderSummary } from '../../../components'
import { formatPrice } from '../../../util'

interface Props {
  order: Order
}

const status = {
  'PENDING': 'Pendiente',
  'PAID': 'Pagado',
  'CANCELLED': 'Cancelado',
}

const AdminOrderPage:NextPage<Props> = ({order}) => {

  return (
    <AppLayout title="Resumen de la orden de usuario">
      <div className='py-2'>
        <h1 className='text-center text-2xl'>Resumen de la orden</h1>
        <h2 className='text-center text-xl'>Estado de la orden: { status[order.status] }</h2>
        <h2 className='text-center text-xl'>Total { formatPrice(order.total) }</h2>

        <OrderSummary order={order}/>
      </div>
    </AppLayout>
  )
}

export default AdminOrderPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if( !session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const orderId = ctx.query.orderId?.toString()
  const order = await dbOrders.getOrderById(orderId || '')

  return {
    props: { order }
  }
}
