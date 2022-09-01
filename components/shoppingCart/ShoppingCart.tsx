import { HiX } from 'react-icons/hi'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { closeShoppingCart } from '../../app/slices/uiSlice'
import { dbLocal, formatPrice } from '../../util'
import { removeItem } from '../../app/slices/shoppingCartSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import styles from './ShoppingCart.module.css'

const headerHeight = '65px'
const footerHeight = '108px'

export const ShoppingCart = () => {
  const dispatch = useAppDispatch()
  const { isShoppingCartOpen } = useAppSelector(state => state.ui)
  const { items, total } = useAppSelector(state => state.cart)
  const router = useRouter()

  const onClose = () => {
    dispatch( closeShoppingCart() )
  }

  const onRemove = (id:string) => {
    dispatch(removeItem({ id }))
    dbLocal.removeItemInLocal({items, total}, id)
  }

  const goToCheckout = () => {
    dispatch( closeShoppingCart() )
    router.push('/checkout')
  }

  return (
    <div
      className={`fixed top-0 right-0 min-h-screen h-screen min-w-[360px] bg-dark z-50 transition-transform ${isShoppingCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div
        className='flex justify-between items-center border-b border-strokeLight p-4'
        style={{ height: headerHeight }}
      >
        <HiX
          size={28}
          onClick={ () => onClose()}
          cursor="pointer"
          data-testid="close-shopping-cart-icon"
        />

        <h2 className="text-center text-2xl">Carrito de compra</h2>
        <div className='w-7'></div>
      </div>
      <div
        style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        className={`flex flex-col gap-4 items-center overflow-y-scroll ${styles['cartlist-items']}`}
      >
        {
          items.map( item => {
            const title = `${item.product.serie.name} #${item.product.number}`
            return (
              <div key={item.product.id} className="flex">
                <Image
                  src={item.product.imgURL}
                  layout="fixed"
                  width={ 100 }
                  height={ 100 }
                  className="object-contain"
                  data-testid="cart-item"
                />
                <div className='px-2 w-52'>
                  <h2>{title}</h2>
                  <h2>Cantidad: {item.amount}</h2>
                  <h2>Subtotal: {formatPrice(item.amount * item.product.price)}</h2>
                  <button className='text-error text-sm' onClick={ () => onRemove(item.product.id) }>Eliminar del carrito</button>
                </div>
              </div>
            )
          })
        }
      </div>
      <div
        className='bg-dark absolute left-0 w-full px-4 py-4 border-t border-strokeLight'
        style={{ height: footerHeight }}
      >
        <h2 className='text-center text-2xl mb-2'>Total global: { formatPrice( total) }</h2>
        <button
          className='btn bg-accent w-full'
          onClick={ () => goToCheckout() }
        >Ir al resumen</button>
      </div>
    </div>
  )
} 
