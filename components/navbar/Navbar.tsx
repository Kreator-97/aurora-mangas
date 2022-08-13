import Image from 'next/image'
import { HiMenu, HiOutlineShoppingCart, HiOutlineSearchCircle } from 'react-icons/hi'

import styles from './Navbar.module.css'

export const Navbar = () => {
  return (
    <nav className={ styles.container }>
      <div className={ styles.content }>

        <Image
          src="/images/logo.png"
          alt="Aurora Mangas Logo"
          width={150}
          height={30}
          layout="fixed"
          className='cursor-pointer'
        />
        <HiOutlineShoppingCart
          color='white'
          size={32}
          cursor="pointer"/>
        <HiMenu
          color='white'
          size={32}
          cursor="pointer"
        />
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
