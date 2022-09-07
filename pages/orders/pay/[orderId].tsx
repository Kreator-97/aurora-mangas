import { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'
import { useMutation } from '@apollo/client'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { OrderResponseBody } from '@paypal/paypal-js'

import { Address, Order } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { CONFIRM_PAYPAL_ORDERID, CREATE_OR_UPDATE_DIRECTION } from '../../../graphql/client'
import { dbOrders } from '../../../database'
import { FormAddress, Table } from '../../../components'
import { formatPrice } from '../../../util'
import { Response } from '../../../interfaces/graphql'

interface Props {
  order: Order;
}

const PayOrderPage:NextPage<Props> = ({order}) => {
  const address = order.user.address
  const router = useRouter()
  const [ editAddress, setEditAddress ] = useState(!address ? true : false)
  const [ addressState, setAddressState] = useState<Address | undefined>(address)

  const [ confirmPaypalOrderId ] = useMutation(CONFIRM_PAYPAL_ORDERID)
  const [ createOrUpdateDirection ] = useMutation(CREATE_OR_UPDATE_DIRECTION)
  
  const onOrderCompleted = async (details: OrderResponseBody) => {
    if( details.status !== 'COMPLETED' ) {
      toast.error('El pago no fue procesado')
    }

    try {
      const { data } = await confirmPaypalOrderId({
        variables: {
          paypalOrderId: details.id,
          orderId: order.id
        }
      })

      const { ok, message, error } = data.confirmPaypalOrder as Response

      if( !ok ) {
        console.error(error)
        throw new Error(message)
      }

      toast.success('Tu compra ha sido realizada')
      setTimeout(() => {
        router.push('/orders')
      }, 2000)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const onAddressChange = async (formValues: any) => {
    setEditAddress(false)
    
    try {
      const { data } = await createOrUpdateDirection({
        variables: {
          userId: order.user.id,
          address: {
            ...formValues
          }
        }
      })

      const { message, ok, error } = data.createAndUpdateDirection
      setAddressState(formValues)
      if( !ok ) {
        console.log(message)
        throw new Error(error)
      }

      toast.success(message)

    } catch (error) {
      console.error(error)
      toast.error((error as {message: string}).message)
    }
  }

  return (
    <AppLayout title="Pagar Orden" maxWidth='sm'>
      <div className='py-4'>
        <h1 className='text-center text-xl'>Orden: {order.id}</h1>

        <section>
          {
            (editAddress)
              ? (
                <FormAddress onSubmit={ onAddressChange } address={ addressState}/>
              )
              : (<div className='mb-4'>
                <p className='text-center text-xl mb-2'>Dirección del usuario</p>
                <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
                  <p className='border border-strokeLight border-solid px-2'>Estado</p>
                  <p className='border border-strokeLight border-solid px-2'>{addressState?.state}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
                  <p className='border border-strokeLight border-solid px-2'>Ciudad</p>
                  <p className='border border-strokeLight border-solid px-2'>{addressState?.city}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
                  <p className='border border-strokeLight border-solid px-2'>Colonia</p>
                  <p className='border border-strokeLight border-solid px-2'>{addressState?.col}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
                  <p className='border border-strokeLight border-solid px-2'>Número de domicilio</p>
                  <p className='border border-strokeLight border-solid px-2'>{addressState?.number}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
                  <p className='border border-strokeLight border-solid px-2'>Código postal</p>
                  <p className='border border-strokeLight border-solid px-2'>{addressState?.cp}</p>
                </div>
                <button
                  className='btn bg-accent text-sm w-full'
                  onClick={ () => setEditAddress(true) }
                >Cambiar dirección</button>
              </div>)
          }
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
          {
            addressState 
              ? (
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'white', tagline: false, label: 'buynow' }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
      
                        amount: {
                          currency_code: 'MXN',
                          value: order.total.toString(),
                        }
                      }]
                    })
                      .then((orderId) => {
                        return orderId
                      })
                  }}
                  onApprove={(data, actions) => {
                    return actions.order!.capture().then((details) => {
                      onOrderCompleted(details)
                    })
                  }}
                />
              ) 
              : (
                <p className='text-center'>Agrega una dirección válida antes de realizar tu compra</p>
              )
          }
        </section>
        <Toaster position='top-center'/>
      </div>
    </AppLayout>
  )
}

export default PayOrderPage

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const redirectHome = {
    redirect: {
      destination: '/',
      permanent: false
    }
  }

  if( !session ) {
    return redirectHome
  }

  const orderId = ctx.query.orderId?.toString()
  if( !orderId ) {
    return redirectHome
  }

  const order = await dbOrders.getOrderById(orderId)

  if ( !order ) {
    return redirectHome
  }

  if( order.userId !== session.user.id ) {
    console.log('La orden de pago no pertenece a este usuario')
    return redirectHome
  }

  if( order.status === 'PAID' || order.status === 'CANCELLED' ) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }

  return {
    props: {
      order
    }
  }
}
