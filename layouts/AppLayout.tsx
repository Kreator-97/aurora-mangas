import { useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { dbLocal } from '../util'
import { login } from '../app/slices/authSlice'
import { Navbar, Footer, ShoppingCart } from '../components'
import { setShoppingCart } from '../app/slices/shoppingCartSlice'
import { Sidebar } from '../components'
import { useAppDispatch } from '../app/hooks'

interface Props {
  title     : string;
  children  : React.ReactNode;
  maxWidth? : 'sm' | 'md' | 'lg' | 'xl' | 'max'
}

export const AppLayout: NextPage<Props> = ({ title, children, maxWidth = 'xl' }) => {
  const { status, data } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if( status === 'authenticated' ) {
      dispatch(login({user: data?.user}))
    }
  }, [status])

  useEffect(() => {
    const cart = dbLocal.loadShoppingCart()
    if( cart ) {
      dispatch( setShoppingCart(cart) )
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title> 
      </Head>
      <Navbar />
      <Sidebar />
      <ShoppingCart />
      <main
        className='main'
        style={{
          maxWidth: `var(--${maxWidth})`
        }}
      >
        {
          children
        }
      </main>
      <Footer />
    </>
  )
}
