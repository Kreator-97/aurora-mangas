import Image from 'next/image'
import { useRouter } from 'next/router'
import { HiMenu, HiOutlineShoppingCart, HiOutlineSearchCircle } from 'react-icons/hi'
import { useAppDispatch } from '../../app/hooks'
import { open } from '../../app/slices/uiSlice'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const openMenu = () => {
    dispatch( open() )
  }

  const navigateTo = (url:string) => {
    router.push(url)
  } 

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
          onClick={ () => navigateTo('/') }
        />
        <HiOutlineShoppingCart
          color='white'
          size={32}
          cursor="pointer"/>
        <HiMenu
          color='white'
          size={32}
          cursor="pointer"
          onClick={ () => openMenu() }
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
