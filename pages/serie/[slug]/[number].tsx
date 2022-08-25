import { FC } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'

import { AppLayout } from '../../../layouts'
import { dbMangas } from '../../../database'
import { Manga } from '../../../interfaces'
import { useCounter } from '../../../hooks'
import { useDispatch } from 'react-redux'
import { addItem } from '../../../app/slices/shoppingCartSlice'
import { openShoppingCart } from '../../../app/slices/uiSlice'

interface Props {
  manga: Manga;
}

const MangaPage:FC<Props> = ({manga}) => {
  const dispatch = useDispatch()

  const { counter, increment, decrement } = useCounter({initial:1, minValue: 1})
  const title = `${manga.serie.name} #${manga.number}`

  const onAddToCart = () => {
    dispatch( addItem({amount: counter, product: manga}))
    dispatch( openShoppingCart() )
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
          <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
            <p className='border border-strokeLight border-solid px-2'>Author</p>
            <p className='border border-strokeLight border-solid px-2'>{manga.serie.author.name}</p>
          </div>
          <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
            <p className='border border-strokeLight border-solid px-2'>Precio</p>
            <p className='border border-strokeLight border-solid px-2'>${manga.price}</p>
          </div>
          <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
            <p className='border border-strokeLight border-solid px-2'>Publicado en</p>
            <p className='border border-strokeLight border-solid px-2'>{manga.published}</p>
          </div>
          <h2 className='text-lg mb-2 text-center'>Seleccione la cantidad</h2>

          <div className='flex gap-4 mb-2 justify-center'>
            <div>
              <HiOutlineMinusCircle size={28} cursor="pointer" onClick={() => decrement(1) }/>
            </div>
            <div className='font-medium text-2xl px-2'>{ counter }</div>
            <div>
              <HiOutlinePlusCircle size={28} cursor="pointer" onClick={() => increment(1) }/>
            </div>
          </div>
          <button
            className='btn bg-accent w-full'
            onClick={ () => onAddToCart()}
          >
            Agregar al carrito
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
