import { useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { login } from '../app/slices/authSlice'
import { Navbar, Footer } from '../components'
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

  return (
    <>
      <Head>
        <title>{title}</title> 
      </Head>
      <Navbar />
      <Sidebar />
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
