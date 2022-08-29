import Image from 'next/image'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { HiMenu, HiOutlineShoppingCart, HiOutlineSearchCircle } from 'react-icons/hi'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { openSidebar, openShoppingCart } from '../../app/slices/uiSlice'

import styles from './Navbar.module.css'

export const Navbar = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector( state => state.cart)

  const q = router.query.q?.toString()
  const [ searchInput, setSearchInput] = useState(q || '')

  const openMenu = () => {
    dispatch( openSidebar() )
  }

  const openShoppingCartMenu = () => {
    dispatch( openShoppingCart())
  }

  const navigateTo = (url:string) => {
    router.push(url)
  }

  const onSearch = (e:FormEvent) => {
    e.preventDefault()
    navigateTo(`/search?q=${searchInput.replace('#', 'no.')}`)
  }

  return (
    <nav className={ styles.container }>
      <div className={ styles.content }>
        <HiMenu
          color='white'
          size={32}
          cursor="pointer"
          onClick={ () => openMenu() }
          data-testid='menu'
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
          data-testid='cart-menu'
        >
          <HiOutlineShoppingCart
            color='white'
            size={32}
            cursor="pointer"
          />
          <span className='w-6 h-6 text-center font-semibold bg-accentDark bg-opacity-95 rounded-full absolute -top-2 -right-2'>{items.length}</span>
        </div>
        <form
          className='flex col-span-2'
          onSubmit={ onSearch }
          data-testid="search-form"
        >
          <input
            type="search"
            placeholder='Encuentra tu manga favorito. Ejemplo: one punch man #1'
            className='w-full rounded border-cyan-400 border p-1 text-sm text-dark'
            value={ searchInput }
            onChange={ (e) => setSearchInput(e.target.value) }
          />
        </form>
        <HiOutlineSearchCircle
          color='white'
          size={32}
          cursor="pointer"
        />
      </div>
    </nav>
  )
}
