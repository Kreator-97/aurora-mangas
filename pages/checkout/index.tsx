import { GetServerSideProps, NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import Image from 'next/image'

import { AppLayout } from '../../layouts'
import { dbLocal, formatPrice } from '../../util'
import { removeItem, setAmount } from '../../app/slices/shoppingCartSlice'
import { SelectAmount } from '../../components/selectAmount/SelectAmount'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface Props {
  user: Session | null;
}

const CheckoutPage:NextPage<Props> = ({user}) => {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector(state => state.cart)

  const onIncrement = (amount:number, id:string ) => {
    const newAmount = amount < 1 ? 1 : amount
    dispatch(setAmount({amount: newAmount, id}))
    dbLocal.setProductAmountInLocal({items, total}, newAmount, id)
  }
  
  const onDecrement = (amount:number, id:string ) => {
    const newAmount = amount < 1 ? 1 : amount
    dispatch(setAmount({amount: amount < 1 ? 1 : amount, id}))
    dbLocal.setProductAmountInLocal({items, total}, newAmount, id)
  }

  const onRemoveItem = (id:string) => {
    dispatch(removeItem({id}))
    dbLocal.removeItemInLocal({items, total}, id)
  }

  if ( items.length === 0) {
    return (
      <AppLayout title="Resumen de compra">
        <div className='mb-4'>
          <h1 className='title'>Resumen de compra</h1>
          <h2 className='text-center'>Este es el resumen de compra, si está satisfecho confirme su pedido</h2>
        </div>
        <h2 className='text-center text-lg'>No tienes elementos en el carrito de compras</h2>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Resumen de compra">
      <div className='mb-4'>
        <h1 className='title'>Resumen de compra</h1>
        <h2 className='text-center'>Este es el resumen de compra, si está satisfecho confirme su pedido</h2>
      </div>

      <div className='max-w-sm grid grid-cols-1 gap-4 mx-auto mb-8'>
        {
          items.map( item => {
            const title = `${item.product.serie.name} #${item.product.number}`
            return (
              <div key={item.product.id} className="flex gap-4 justify-center">
                <Image
                  src={item.product.imgURL}
                  layout="fixed"
                  width={100}
                  height={150}
                />
                <div>
                  <h2 className='text-xl '>{title}</h2>
                  <h2 className='text-xl '>Subtotal: { formatPrice( item.amount * item.product.price )}</h2>
                  <button onClick={ () => onRemoveItem(item.product.id) } className='text-error text-lg'>Eliminar</button>
                  <SelectAmount
                    initial={ item.amount }
                    onIncrement={ onIncrement }
                    onDecrement={ onDecrement }
                    id={item.product.id}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      <div className='max-w-sm grid grid-cols-1 gap-4 mx-auto mb-4'>
        { 
          !user && (
            <div>
              <p className='text-center text-alert'>Necesitas iniciar sesión para realizar tu compra</p>
              <p className='text-center text-alert'>Inicia sesión o crea una cuenta para continuar</p>
            </div>
          )
        }
        <h2 className='title'>Total: {formatPrice(total)}</h2>
        <button
          className='btn bg-accent w-full'
          disabled={ !user }
        >
          Confirmar pedido
        </button>
        <p className='text-success text-center' >El pago es procesado a través de Paypal</p>
      </div>
    </AppLayout>
  )
}

export default CheckoutPage

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  return {
    props: { user: session }
  }
}
