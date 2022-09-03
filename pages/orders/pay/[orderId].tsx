import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { Table } from '../../../components'

import { dbOrders } from '../../../database'
import { Order } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { formatPrice } from '../../../util'

interface Props {
  order: Order;
}

const PayOrderPage:NextPage<Props> = ({order}) => {

  const onPayOrder = () => {
    console.log('Hay que realizar el pago en paypal')
  }

  return (
    <AppLayout title="Pagar Orden" maxWidth='sm'>
      <div className='py-4'>
        <h1 className='text-center text-xl'>Orden: {order.id}</h1>

        <section className='mt-2 mb-8'>
          <h2 className='text-xl text-center'>Verifica tu dirección de entrega</h2>

          <div className='flex flex-col mb-4'>
            <label htmlFor="state">
              Estado:
            </label>
            <input
              className='input text-dark'
              type="text"
              name='state'
              readOnly
              value="Chiapas"
            />
          </div>

          <div className='flex flex-col mb-4'>
            <label htmlFor="city">
              Ciudad:
            </label>
            <input
              className='input text-dark'
              type="text"
              name='city'
              readOnly
              value="Tuxtla Gutierrez"
            />
          </div>

          <div className='flex flex-col mb-4'>
            <label htmlFor="col">
              Colonia:
            </label>
            <input
              className='input text-dark'
              type="text"
              name='col'
              readOnly
              value="Callejon el zapote"
            />
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col mb-4'>
              <label htmlFor="numero">
              Numero de domicilio:
              </label>
              <input
                className='input text-dark'
                type="text"
                name='numero'
                readOnly
                value="604"
              />
            </div>

            <div className='flex flex-col mb-4'>
              <label htmlFor="cp">
              Código postal:
              </label>
              <input
                className='input text-dark'
                type="text"
                name='cp'
                readOnly
                value="25040"
              />
            </div>
          </div>
          <button className='btn bg-accent w-full'>Guardar dirección</button>
        </section>
        <section className='mb-8'>
          <h2 className='text-center text-xl mb-2'>Resumen de la orden</h2>

          <Table columns={['Cantidad', 'Descripción', 'Precio']}>
            {
              order.items.map( item => {
                return (
                  <tr key={item.product.id}>
                    <td>{item.amount}</td>
                    <td>{item.product.title}</td>
                    <td>{ formatPrice(item.product.price)}</td>
                  </tr>
                )
              })
            }
          </Table>
        </section>

        <section>
          <h2 className='text-center text-xl mb-2'>Total a pagar { formatPrice(order.total) } MXN</h2>
          <button
            className='px-4 py-4 rounded border border-white bg-accent w-full'
            onClick={ () => onPayOrder() }
          >
            PAGAR
          </button>
        </section>
      </div>
    </AppLayout>
  )
}

export default PayOrderPage

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
  if( !orderId ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(orderId)

  if ( !order ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if( order.userId !== session.user.id ) {
    console.log('La orden de pago no pertenece a este usuario')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // TODO: Agregar validación
  // redireccionar al usuario si la orden la fue pagada

  return {
    props: {
      order
    }
  }
}
