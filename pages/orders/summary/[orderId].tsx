import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'

import { AppLayout } from '../../../layouts'
import { CustomRow } from '../../../components'
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

        <div className='flex flex-col gap-4 my-4 max-w-[520px] mx-auto'>
          {
            order.items.map((item) => {
              const { product } = item
              return (
                <div
                  key={product.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr',
                    gap: '1rem',
                    backgroundColor: 'var(--dark-transparent)',
                    padding: '1rem',
                    borderRadius: '4px',
                  }}
                >
                  <div className='flex flex-col items-center'>
                    <Image src={product.imgURL} layout='fixed' width={150} height={225} />
                  </div>
                  <div>
                    <CustomRow name={'Nombre'} value={`${product.serie.name } #${product.number}`}/>
                    <CustomRow name={'Cantidad'} value={item.amount}/>
                    <CustomRow name={'Precio unitario'} value={formatPrice(product.price)}/>
                    <CustomRow name={'Publicación'} value={product.published}/>
                  </div>
                </div>
              )
            })
          }
        </div>
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
