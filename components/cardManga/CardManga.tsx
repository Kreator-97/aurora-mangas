import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
    <div className="bg-white relative min-w-[225px] max-w-[450px] rounded w-full" data-testid="card-manga">
      <Image
        src={manga.imgURL}
        layout="responsive"
        width={ 170 }
        height={ 255 }
        className="object-contain cursor-pointer rounded-t"
        onClick={ () => router.push(`/serie/${manga.serie.slug}/${manga.number}`) }
        alt={ manga.title }
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
          disabled={ manga.stock === 0 }
        >
          { manga.stock === 0 ? 'Sin stock disponible' : 'Agregar al carrito' }
        </button>
      </div>
      <div className='absolute bg-dark bg-opacity-80 top-2/4 right-2 rounded-full'>
        <p className='text-2xl px-2 py-4 w-16 text-center'># {manga.number}</p>
      </div>
      <Toaster position='bottom-left' />
    </div>
  )
}
