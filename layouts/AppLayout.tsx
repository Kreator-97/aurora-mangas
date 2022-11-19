import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { dbLocal } from '../util'
import { login } from '../app/slices/authSlice'
import { Navbar, Footer, ShoppingCart, Sidebar, Modal } from '../components'
import { setShoppingCart } from '../app/slices/shoppingCartSlice'
import { useAppDispatch } from '../app/hooks'

interface Props {
  title     : string;
  children  : React.ReactNode;
  maxWidth? : 'sm' | 'md' | 'lg' | 'xl' | 'max'
}

export const AppLayout: NextPage<Props> = ({ title, children, maxWidth = 'xl' }) => {
  const { status, data } = useSession()
  const [ showDisclamerAlert, setShowDisclamerAlert ] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if( status === 'authenticated' ) {
      dispatch(login({user: data?.user}))
    }
  }, [status]) // eslint-disable-line

  useEffect(() => {
    const cart = dbLocal.loadShoppingCart()
    if( cart ) {
      dispatch( setShoppingCart(cart) )
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    const showWarning = JSON.parse( localStorage.getItem('show-warning-paypal') || 'true' )
    console.log(showWarning)

    setShowDisclamerAlert(showWarning)
  }, [])

  const onAcceptDisclamer = () => {
    localStorage.setItem('show-warning-paypal', 'false')
    setShowDisclamerAlert(false)
  }

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
      <Modal title='Aviso importante' isOpen={showDisclamerAlert} onClose={ () => onAcceptDisclamer() }>
        <div>
          <p className='text-lg text-center text-dark whitespace-pre'>
            Los cobros realizados en este sitio son una simulación.
          </p>
          <p className='text-lg text-center text-dark whitespace-pre'>
            Se está utilizando la API de Paypal en modo Sandbox.
          </p>
          <p className='text-lg text-center text-dark whitespace-pre'>
            Este sitio es una demostración hecha por razones educativas.
          </p>
        </div>
      </Modal>
      <Footer />
    </>
  )
}
