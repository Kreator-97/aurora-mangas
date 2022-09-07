import { GetServerSideProps, NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useMutation } from '@apollo/client'
import { Toaster, toast } from 'react-hot-toast'

import { AppLayout } from '../../layouts'
import { cleanShoppingCart, removeItem, setAmount } from '../../app/slices/shoppingCartSlice'
import { CREATE_ORDER } from '../../graphql/client/mutations'
import { dbLocal, formatPrice } from '../../util'
import { OrderResponse } from '../../interfaces/graphql'
import { SelectAmount } from '../../components'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface Props {
  user: Session | null;
}

const CheckoutPage:NextPage<Props> = ({user}) => {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector(state => state.cart)
  const [ createOrder ] = useMutation(CREATE_ORDER)
  const router = useRouter()

  const onChangeAmount = (newValue: number, id: string) => {
    dispatch(setAmount({amount: newValue, id}))
    dbLocal.setProductAmountInLocal({items, total}, newValue, id)
  }

  const onRemoveItem = (id:string) => {
    dispatch(removeItem({id}))
    dbLocal.removeItemInLocal({items, total}, id)
  }

  const onCreateOrder = async () => {
    const newItems = items.map((item) => {
      return {
        productId: item.product.id,
        amount: item.amount
      }
    })
    try {
      const { data } = await createOrder({
        variables: {
          total,
          items: newItems,
        }
      })
      
      const { ok, message, error, orderId } = (data.createOrder) as OrderResponse
      if ( !ok ) {
        console.error(error)
        throw new Error(message)
      }

      toast.success(message)
      window.setTimeout(() => {
        // clean localstorage and redux state
        dbLocal.cleanShoppingCart()
        dispatch(cleanShoppingCart())
        router.push(`/orders/pay/${orderId}`)
      }, 2000)
    } catch (error) {
      toast.error((error as {message: string}).message)
    }
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
                    onChangeAmount={ onChangeAmount }
                    minValue={1}
                    maxValue={item.product.stock}
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
              <button
                className='btn bg-accent mt-2 w-full'
                onClick={ () => router.push('/auth/login') }
              >Iniciar sesión</button>
            </div>
          )
        }
        <h2 className='title'>Total: {formatPrice(total)}</h2>
        <button
          className='btn bg-accent w-full'
          disabled={ !user }
          onClick={ () => onCreateOrder() }
        >
          Confirmar pedido
        </button>
        <p className='text-success text-center' >El pago es procesado a través de Paypal</p>
      </div>
      <Toaster position='top-center'/>
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
