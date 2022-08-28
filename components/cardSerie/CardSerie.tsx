import { FC } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Serie } from '../../interfaces'

interface Props {
  serie: Serie;
  children?: React.ReactNode 
}

export const CardSerie: FC<Props> = ({ serie }) => {
  const router = useRouter()
  
  const goToPage = () => {
    const url = serie.isNewRelease ? `/suscribe/${serie.slug}` : `/serie/${serie.slug}`
    router.push(url)
  }

  return (
    <div
      className='relative w-full max-w-[var(--md)]'
      data-testid="card-serie"
    >
      <Image
        src={ serie.imgURL }
        width={360}
        height={180}
        layout="responsive"
        alt={ serie.name }
        className='object-cover'
      />
      <div className="absolute bottom-0 bg-dark bg-opacity-75 w-full p-2 flex items-center justify-between ">
        <div>
          <h2 className='text-lg sm:text-xl'>Serie: { serie.name }</h2>
          <p className='font-light'>Peridiocidad: { serie.periodicy }</p>
        </div>
        <button className='btn bg-accent' onClick={ ()=> goToPage() }>{ serie.isNewRelease ? 'Suscribirse' : 'Ver serie' }</button>
      </div>
    </div>
  )
}
