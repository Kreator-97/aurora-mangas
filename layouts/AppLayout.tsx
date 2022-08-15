import { NextPage } from 'next'
import Head from 'next/head'

import { Navbar, Footer } from '../components'
import { Sidebar } from '../components/sidebar/Sidebar'

interface Props {
  title     : string;
  children  : React.ReactNode;
  maxWidth? : 'sm' | 'md' | 'lg' | 'xl' | 'max'
}

export const AppLayout: NextPage<Props> = ({ title, children, maxWidth = 'xl' }) => {
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
