import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { AppLayout } from '../../../layouts'
import { dbOrders } from '../../../database'
import { formatPrice } from '../../../util'
import { Order } from '../../../interfaces'

interface Props {
  order: Order;
}

const OrderSummary: NextPage<Props> = ({order}) => {
  return (
    <AppLayout title="Resumen de la orden" maxWidth='md'>
      <div className='p-2'>
        <h1 className='title'>Resumen de la orden</h1>
        <h2 className='text-center text-2xl'>Total pagado: {formatPrice( order.total )}</h2>

        <OrderSummary order={order}/>
      </div>
    </AppLayout>
  )
}

export default OrderSummary

export const getServerSideProps:GetServerSideProps = async (ctx) => {
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

  const order = await dbOrders.getOrderById( orderId || '' )

  return {
    props: {
      order,
    }
  }

}
