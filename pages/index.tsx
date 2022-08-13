import type { NextPage } from 'next'
import { AppLayout } from '../layouts/AppLayout'

const Home: NextPage = () => {
  return (
    <AppLayout title='Aurora Mangas | Página de inicio'>
      <h1 className='text-xl md:text-2xl lg:3xl text-center py-2'>
        Series nuevas
      </h1>
    </AppLayout>
  )
}

export default Home
