import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { HiOutlineHeart } from 'react-icons/hi'
import { Manga } from '../../interfaces'

interface Props {
  manga: Manga;
}

export const CardManga:FC<Props> = ({manga}) => {
  const router = useRouter()

  const navigateTo = (url:string) => {
    router.push(url)
  }
  
  return (
    <div className="bg-white relative">
      <Image
        src={manga.imgURL}
        layout="responsive"
        width={ 170 }
        height={ 255 }
        className="object-contain cursor-pointer"
        onClick={ () => navigateTo('/serie/hunter-x-hunter/01') }
      />
      <div className='p-2 flex flex-col items-center'>
        <Link passHref href={`/serie/${manga.serie.name}`}>
          <a className='text-dark text-xl text-center'>{ manga.serie.name } #{manga.number}</a>
        </Link>
        <p className='text-dark text-lg'>$ { manga.price }</p>
        <button className='btn bg-accent text-dark w-full'>Agregar al carrito</button>
      </div>
      <div className='p-1 bg-light absolute top-4 right-2 rounded-full'>
        <HiOutlineHeart color='var(--dark)' className='' size={36}/>
      </div>
      <div className='absolute bg-dark bg-opacity-75 top-2/4 right-2 rounded-full'>
        <p className='text-2xl p-2'># {manga.number}</p>
      </div>
    </div>
  )
}
