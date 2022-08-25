import Image from 'next/image'
import { useRouter } from 'next/router'
import { HiMenu, HiOutlineShoppingCart, HiOutlineSearchCircle } from 'react-icons/hi'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { openSidebar, openShoppingCart } from '../../app/slices/uiSlice'

import styles from './Navbar.module.css'

export const Navbar = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector( state => state.cart)
  
  const openMenu = () => {
    dispatch( openSidebar() )
  }

  const openShoppingCartMenu = () => {
    dispatch( openShoppingCart())
  }

  const navigateTo = (url:string) => {
    router.push(url)
  } 

  return (
    <nav className={ styles.container }>
      <div className={ styles.content }>
        <HiMenu
          color='white'
          size={32}
          cursor="pointer"
          onClick={ () => openMenu() }
        />
        <Image
          src="/images/logo.png"
          alt="Aurora Mangas Logo"
          width={150}
          height={30}
          layout="fixed"
          className='cursor-pointer'
          onClick={ () => navigateTo('/') }
        />
        <div
          className='relative cursor-pointer'
          onClick={ () => openShoppingCartMenu() }
        >
          <HiOutlineShoppingCart
            color='white'
            size={32}
            cursor="pointer"
          />
          <span className='w-6 h-6 text-center font-semibold bg-accentDark bg-opacity-95 rounded-full absolute -top-2 -right-2'>{items.length}</span>
        </div>
        <input
          type="search"
          placeholder='Encuentra tu manga favorito'
          className='col-span-2 rounded border-cyan-400 border p-1 text-sm text-dark'
        />
        <HiOutlineSearchCircle
          color='white'
          size={32}
          cursor="pointer"
        />
      </div>
    </nav>
  )
}
