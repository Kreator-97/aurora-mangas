import { FC } from 'react'
import Image from 'next/image'

interface Props {
  serie: string;
  imgURL : string;
  periodicy: 'mensual' | 'bimestral'
}

export const CardSuscribe: FC<Props> = ({ serie, imgURL, periodicy }) => {
  return (
    <div className='relative max-w-[var(--md)]'>
      <Image
        src={ imgURL }
        width={360}
        height={180}
        layout="responsive"
        alt={ serie }
        className='object-cover'
      />
      <div className="absolute bottom-0 bg-dark bg-opacity-75 w-full p-2 flex items-center justify-between ">
        <div>
          <h2 className='text-lg- sm:text-xl'>Serie: { serie }</h2>
          <p className='font-light'>Peridiocidad: { periodicy }</p>
        </div>
        <button className='btn'>Suscribirse</button>
      </div>
    </div>
  )
}
