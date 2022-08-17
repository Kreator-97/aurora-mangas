import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiOutlineHeart } from 'react-icons/hi'

export const CardManga = () => {
  const router = useRouter()

  const navigateTo = (url:string) => {
    router.push(url)
  }
  
  return (
    <div className="bg-white relative">
      <Image
        src='/images/mangas/hxh-01.jpeg'
        layout="responsive"
        width={ 170 }
        height={ 255 }
        className="object-contain cursor-pointer"
        onClick={ () => navigateTo('/serie/hunter-x-hunter/01') }
      />
      <div className='p-2 flex flex-col items-center'>
        <Link passHref href='/serie/hunter-x-hunter'>
          <a className='text-dark text-xl text-center'>Hunter x Hunter</a>
        </Link>
        <p className='text-dark text-lg'>$ 99.00</p>
        <button className='btn bg-accent text-dark w-full'>Agregar al carrito</button>
      </div>
      <div className='p-1 bg-light absolute top-4 right-2 rounded-full'>
        <HiOutlineHeart color='var(--dark)' className='' size={36}/>
      </div>
      <div className='absolute bg-dark bg-opacity-75 top-2/4 right-2 rounded-full'>
        <p className='text-2xl p-2'># 1</p>
      </div>
    </div>
  )
}
