import { NextPage } from 'next'
import Image from 'next/image'
import { FaCcPaypal } from 'react-icons/fa'

import { Serie } from '../../interfaces'
import { AppLayout } from '../../layouts'
import { series } from '../index'

interface Props {
  serie: Serie;
}

const serie = series[0]

const SuscribeSeriePage: NextPage<Props> = () => {
  return (
    <AppLayout title={ `${serie.name} | subscripción` } maxWidth='lg'>
      <h1 className='text-xl text-center py-2'>{ serie.name }</h1>
      <Image
        src={serie.imgURL }
        width={360}
        height={180}
        layout="responsive"
        className='object-cover'
      />
      <h2 className='text-xl text-center mt-4'>Sipnosis</h2>
      <p className='text-lg m-4'>
        {
          serie.sipnosis
        }
      </p>
      <h2 className='text-xl text-center mt-4 mb-2'>Información</h2>
      <div className='px-4'>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Nombre</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.name}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Author</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.author.name} ({serie.author.birthDate})</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Volumenes</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.volumes.length}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Precio unitario</p>
          <p className='border border-strokeLight border-solid px-2'>$ {serie.unitPrice}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Periodicidad</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.periodicy}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Géneros</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.genre.join(', ')}</p>
        </div>
      </div>
      
      <section className='p-4 flex flex-col gap-y-2 items-center max-w-screen-sm mx-auto'>
        <h2 className='text-center text-2xl text-success'>Suscripción</h2>
        <p className='text-base text-success text-center'>
        Suscríbete y obtén todos los volúmenes en su fecha de publicación sin costo por envío + 5% de descuento
        </p>
        <button className='btn bg-success-gradient w-full text-lg'>Suscríbete por $3698</button>
        <p className='text-center'>Pago seguro procesado a través de:</p>
        <FaCcPaypal size={64}/>
      </section>
    </AppLayout>
  )
}

export default SuscribeSeriePage
