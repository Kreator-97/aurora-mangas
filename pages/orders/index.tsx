import { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { getSession } from 'next-auth/react'

import { dbOrders } from '../../database'
import { Order } from '../../interfaces'
import { AppLayout } from '../../layouts'
import { formatPrice } from '../../util'

interface Props {
  orders: Order[];
}

const OrderPage: NextPage<Props> = ({orders}) => {
  const ordersPaid = orders.filter(order => order.status === 'PAID')
  const ordersPending = orders.filter(order => order.status === 'PENDING')
  const ordersCancelled = orders.filter(order => order.status === 'CANCELLED')
  const [ orderStatus, setOrderStatus ] = useState<'PAID' | 'PENDING' | 'CANCELLED'>(ordersPaid.length === 0 ? 'PENDING' : 'PAID')

  return (
    <AppLayout title="Ordenes realizadas" maxWidth='lg'>
      <div className='px-2'>
        <h1 className="title">Ordenes del usuario</h1>
        <div>
          <button
            className={`btn ${orderStatus === 'PAID' ? 'bg-accent' : 'ghost' } mr-2`}
            onClick={ () => setOrderStatus('PAID')}
          >Pagadas
          </button>
          <button
            className={`btn ${orderStatus === 'PENDING' ? 'bg-accent' : 'ghost' } mr-2`}
            onClick={ () => setOrderStatus('PENDING')}
          >Pendientes
          </button>
          <button
            className={`btn ${orderStatus === 'CANCELLED' ? 'bg-accent' : 'ghost' }`}
            onClick={ () => setOrderStatus('CANCELLED')}
          >Canceladas
          </button>
        </div>
        {
          orderStatus === 'PAID' && (
            <section>
              <h2 className='text-center text-2xl mb-2'>Ordenes pagadas</h2>
              {
                (ordersPaid.length === 0)
                  ? (<p className='text-center bg-accentDark'>No existen ordenes pagadas</p>)
                  : (
                    <div className='grid grid-cols-2 gap-4'>
                      {
                        ordersPaid.map((order) => {
                          return (
                            <div key={order.id} className="bg-darkTransparent p-2 rounded">
                              <h3>Orden #{order.id}</h3>
                              <p>Fecha: {new Date(order.date).toDateString()}</p>
                              <p>Estado: { order.status }</p>
                              <p>Total pagado: { formatPrice(order.total) }</p>
                              <Link href={`/orders/summary/${order.id}`}>
                                <a className='mt-2 btn bg-accent w-full block text-center text-sm'>Resumen de la orden</a>
                              </Link>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
              }
            </section>
          )
        }
        {
          orderStatus === 'PENDING' && (
            <section>
              <h2 className='text-center text-2xl mb-2'>Ordenes Pendientes</h2>
              {
                ordersPending.length > 0 && (
                  <p className='text-center bg-alert mb-4 text-dark'>Las ordenes pendientes se cancelar??n automaticamente si no se realiza el pago despu??s de 5 minutos</p>
                )
              }
              {
                (ordersPending.length === 0)
                  ? (<p className='text-center bg-accentDark'>No existen ordenes pendientes</p>)
                  : (<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {
                      ordersPending.map((order) => {
                        return (
                          <div key={order.id} className="bg-darkTransparent p-2 rounded">
                            <h3>Orden #{order.id}</h3>
                            <p>Fecha: {new Date(order.date).toDateString()}</p>
                            <p>Estado: { order.status }</p>
                            <p>Total a pagar: { formatPrice(order.total) }</p>
                            <Link href={`/orders/pay/${order.id}`}>
                              <a className='mt-2 btn bg-accent w-full block text-center text-sm'>Pagar orden</a>
                            </Link>
                          </div>
                        )
                      })
                    }
                  </div>)
              }
            </section>
          )}
        {
          orderStatus === 'CANCELLED' && (
            <section>
              <h2 className='text-center text-2xl mb-2'>Ordenes canceladas</h2>
              {
                (ordersCancelled.length === 0)
                  ? (<p className='text-center bg-accentDark'>No existen ordenes canceladas</p>)
                  : (<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {
                      ordersCancelled.map((order) => {
                        return (
                          <div key={order.id} className="bg-darkTransparent p-2 rounded">
                            <h3>Orden #{order.id}</h3>
                            <p>Fecha: {new Date(order.date).toDateString()}</p>
                            <p>Estado: { order.status }</p>
                            <p>Total a pagar: { formatPrice(order.total) }</p>
                          </div>
                        )
                      })
                    }
                  </div>)
              }
            </section>
          )}
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
  const orders = await dbOrders.getOrdersByUserId(user.id)

  return {
    props: {
      orders,
    }
  }
}
