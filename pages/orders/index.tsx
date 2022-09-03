import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import { dbOrders } from '../../database'
import { Order } from '../../interfaces'
import { AppLayout } from '../../layouts'

// TODO: traer las ordenes del usuario usando SSR
interface Props {
  orders: Order[];
}

const OrderPage: NextPage<Props> = ({orders}) => {
  console.log({orders})
  return (
    <AppLayout title="Ordenes realizadas" maxWidth='lg'>
      <div>
        <h1 className="title">Ordenes realizadas</h1>
      </div>
    </AppLayout>
  )
}

export default OrderPage

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session  = await getSession(ctx)
  if( !session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const { user } = session
  const orders = await dbOrders.getOrders(user.id)

  return {
    props: {
      orders,
    }
  }
}
