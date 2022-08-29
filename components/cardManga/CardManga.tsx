import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiOutlineHeart } from 'react-icons/hi'
import { Toaster, toast } from 'react-hot-toast'

import { addItem } from '../../app/slices/shoppingCartSlice'
import { dbLocal, formatPrice } from '../../util'
import { Manga } from '../../interfaces'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface Props {
  manga: Manga;
}

export const CardManga:FC<Props> = ({manga}) => {
  const router = useRouter()
  const { cart } = useAppSelector(state => state)
  const dispatch = useAppDispatch()

  const onAddToCart = () => {
    dispatch( addItem({
      amount: 1,
      product: manga,
    }))
    dbLocal.addItemInLocal(cart, {amount: 1, product: manga})
    toast.success('Producto agregado al carrito')
  }

  return (
    <div className="bg-white relative min-w-[220px] rounded" data-testid="card-manga">
      <Image
        src={manga.imgURL}
        layout="responsive"
        width={ 170 }
        height={ 255 }
        className="object-contain cursor-pointer rounded-t"
        onClick={ () => router.push(`/serie/${manga.serie.slug}/${manga.number}`) }
      />
      <div className='p-2 flex flex-col items-center'>
        <Link passHref href={`/serie/${manga.serie.slug}`}>
          <a className='text-dark text-xl text-center hover:underline'>{ manga.serie.name } #{manga.number}</a>
        </Link>
        <p className='text-dark text-lg'>{ formatPrice(manga.price) }</p>
        <button
          className='btn bg-accent text-dark w-full'
          onClick={ () => onAddToCart()}
          role="button"
        >
          Agregar al carrito
        </button>
      </div>
      <div className='p-1 bg-light absolute top-4 right-2 rounded-full'>
        <HiOutlineHeart color='var(--dark)' className='' size={36}/>
      </div>
      <div className='absolute bg-dark bg-opacity-75 top-2/4 right-2 rounded-full'>
        <p className='text-2xl p-2'># {manga.number}</p>
      </div>
      <Toaster position='bottom-left' />
    </div>
  )
}
