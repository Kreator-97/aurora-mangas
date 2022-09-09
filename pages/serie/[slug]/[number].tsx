import { FC, useState } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { addItem } from '../../../app/slices/shoppingCartSlice'
import { AppLayout } from '../../../layouts'
import { dbLocal, formatPrice } from '../../../util'
import { dbMangas } from '../../../database'
import { Manga } from '../../../interfaces'
import { openShoppingCart } from '../../../app/slices/uiSlice'
import { CustomRow, SelectAmount } from '../../../components'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'

interface Props {
  manga: Manga;
}

const MangaPage:FC<Props> = ({manga}) => {
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector(state => state)
  const [ counter, setCounter] = useState(1)

  const title = `${manga.serie.name} #${manga.number}`

  const onAddToCart = () => {
    dispatch( addItem({amount: counter, product: manga}))
    dispatch( openShoppingCart() )
    dbLocal.addItemInLocal(cart, {amount: counter, product: manga})
  }

  return (
    <AppLayout title={title} maxWidth='md'>
      <div className='grid grid-cols-1 sm:grid-cols-2 py-4'>
        <Image
          src={manga.imgURL}
          alt={title}
          layout="responsive"
          width={ 170 }
          height={ 255 }
          className="object-contain cursor-pointer animate__animated animate__backInLeft"
        />
        <div className='px-4 py-2'>
          <h1 className='text-3xl mb-4'><Link href={`/serie/${manga.serie.slug}`} >{title}</Link></h1>
          <CustomRow name='Author' value={manga.serie.author.name} />
          <CustomRow name='Precio' value={formatPrice(manga.price)} />
          <CustomRow name='Publicado en' value={manga.published} />
          <CustomRow name='Stock' value={manga.stock > 20 ? 'Disponible' : manga.stock } />
          {
            (manga.stock <= 20 && manga.stock !== 0) && (
              <div className='mb-2'>
                <p className='text-alert text-center'>Quedan pocas unidades!</p>
                <p className='text-alert text-center'>Aprovecha y realiza tu compra ahora</p>
              </div>
            )
          }

          {
            manga.stock !== 0 && (
              <SelectAmount
                initial={1}
                onChangeAmount={ (amount) => setCounter(amount)}
                minValue={1}
                maxValue={manga.stock}
              />
            )
          }
          <button
            className='btn bg-accent w-full mt-2'
            onClick={ () => onAddToCart()}
            disabled={ manga.stock === 0 }
          >
            { manga.stock === 0 ? 'Sin Stock disponible' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

export default MangaPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const serieName = ctx.query.slug?.toString()
  const number = ctx.query.number?.toString()

  const manga = await dbMangas.getMangaBySerieAndNumber(serieName || '', number || '')

  if( !manga ) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      manga 
    }
  }
}
