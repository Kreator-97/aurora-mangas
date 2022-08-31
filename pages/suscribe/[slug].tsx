import { NextPage, GetServerSideProps } from 'next'
import Image from 'next/image'
import { FaCcPaypal } from 'react-icons/fa'

import { AppLayout } from '../../layouts'
import { dbSeries } from '../../database'
import { formatPrice } from '../../util'
import { Serie } from '../../interfaces'

interface Props {
  serie: Serie;
}

const SuscribeSeriePage: NextPage<Props> = ({serie}) => {
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
          serie.sinopsis
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
          <p className='border border-strokeLight border-solid px-2'>{serie.author.name}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Volumenes</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.volumes.length}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Periodicidad</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.periodicy}</p>
        </div>
        <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
          <p className='border border-strokeLight border-solid px-2'>Géneros</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.genre}</p>
        </div>
      </div>
      
      <section className='p-4 flex flex-col gap-y-2 items-center max-w-screen-sm mx-auto'>
        <h2 className='text-center text-2xl text-success'>Suscripción</h2>
        <p className='text-base text-success text-center'>
          Suscríbete y obtén todos los volúmenes en su fecha de publicación sin costo por envío
        </p>
        <button
          className='btn bg-success-gradient w-full text-lg'
        >
          { 
            serie.volumes[0]
              ? `Suscribete por ${formatPrice(serie.volumes[0].price)}`
              : 'Suscribete proximamente'
          }
        </button>
        <p>Cargo recurrente {serie.periodicy.toLowerCase()}</p>
        <p className='text-center'>Pago seguro procesado a través de:</p>
        <FaCcPaypal size={64}/>
      </section>
    </AppLayout>
  )
}

export default SuscribeSeriePage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug?.toString()

  const serie = await dbSeries.getSerieBySlug(slug || '')

  if( !serie ) {
    return {
      notFound: true
    }
  }

  if( !serie.isNewRelease ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      serie
    }
  }
}
