import { NextPage } from 'next'
import Head from 'next/head'
import { Navbar } from '../components'

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
        style={{
          minHeight: 'calc(100vh - var(--header-height))',
          backgroundColor: 'var(--bg-color)'
        }}>
        {
          children
        }
      </main>
    </>
  )
}
