import { useEffect } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { AppLayout } from '../layouts'
import { CardGrid, CardManga, Pagination } from '../components'
import { dbLocal } from '../util'
import { dbMangas, dbOrders, dbSeries } from '../database'
import { Manga, Order, Serie, ShoppingCart } from '../interfaces'
import { setShoppingCart } from '../app/slices/shoppingCartSlice'
import { useAppDispatch } from '../app/hooks'

interface Props {
  series: Serie[]
  mangasInfo: {
    mangas: Manga[],
    total: number;
    totalPages: number;
    page: number
  }
  orderCancelled: Order | null;
}

const Home: NextPage<Props> = ({series, mangasInfo, orderCancelled}) => {
  const { mangas, totalPages, page } = mangasInfo
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onPageChange = (page:number) => {
    router.push(`/?page=${page}`)
  }

  useEffect(() => {
    if( orderCancelled ) {
      // if an order was cancelled and there are not items on cart
      // we can restore the shoppingCart state using the order cancelled
      const cart = dbLocal.loadShoppingCart()
      if( cart && cart.items.length === 0 ) {
        orderCancelled
        const newCart:ShoppingCart = {
          items: orderCancelled.items,
          total: orderCancelled.total,
        } 
        dbLocal.setShoppingCart(newCart)
        dispatch( setShoppingCart(newCart) )
      }
    }
  }, [])

  return (
    <AppLayout title='Aurora Mangas | Página de inicio'>
      <h1 className='title'>
        Series nuevas
      </h1>
      <CardGrid series={ series } />
      <h1 className='title'>
        Últimos lanzamientos 
      </h1>

      <CardGrid gridCols='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' >
        {
          mangas.map((manga) => {
            return (
              <CardManga manga={manga} key={manga.id}/>
            )
          })
        }
      </CardGrid>
      <Pagination
        totalPages={totalPages}
        initialPage={page}
        onPageChange={onPageChange}
      />
    </AppLayout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const page = ctx.query.page?.toString()

  const session = await getSession(ctx)

  const [ series, mangas, orderCancelled ] = await Promise.all([
    await dbSeries.getNewReleaseSeries(),
    await dbMangas.getAllMangasPublished(12, Number(page || 1)),
    await dbOrders.checkPendingOrderTime(session?.user.id)
  ])

  return {
    props: {
      series,
      mangasInfo: mangas,
      orderCancelled
    }
  }
}
