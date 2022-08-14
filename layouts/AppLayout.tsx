import { NextPage } from 'next'
import Head from 'next/head'

import { Navbar, Footer } from '../components'

interface Props {
  title: string;
  children: React.ReactNode;
}

export const AppLayout: NextPage<Props> = ({ title, children}) => {
  return (
    <>
      <Head>
        <title>{title}</title> 
      </Head>
      <Navbar />
      <main
        className='main'
      >
        {
          children
        }
      </main>
      <Footer />
    </>
  )
}
