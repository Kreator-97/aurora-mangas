import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { Address, Order } from '../../../interfaces'
import { AppLayout } from '../../../layouts'
import { CREATE_OR_UPDATE_DIRECTION } from '../../../graphql/client'
import { dbOrders } from '../../../database'
import { FormAddress, Table } from '../../../components'
import { formatPrice } from '../../../util'

interface Props {
  order: Order;
}

const PayOrderPage:NextPage<Props> = ({order}) => {
  const address = order.user.address
  const [ editAddress, setEditAddress ] = useState(!address ? true : false)
  const [ addressState, setAddressState] = useState<Address | undefined>(address)

  const [ createOrUpdateDirection ] = useMutation(CREATE_OR_UPDATE_DIRECTION)
  
  const onPayOrder = () => {
    console.log('Hay que realizar el pago en paypal')
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
          <button
            className='btn rounded border border-white bg-success w-full'
            onClick={ () => onPayOrder() }
            disabled={ true }
          >
            PAGAR
          </button>
        </section>
        <Toaster position='top-center'/>
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
