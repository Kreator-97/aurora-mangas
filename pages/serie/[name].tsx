import { GetStaticPaths, GetStaticProps, NextPage  } from 'next'
import Image from 'next/image'

import { AppLayout } from '../../layouts'
import { Serie } from '../../interfaces'
import { series } from '../../data/seed'
import { CardGrid, CardManga } from '../../components'

interface Props {
  serie: Serie
}

const SeriePage: NextPage<Props> = ({serie}) => {
  return (
    <AppLayout title={ serie.name } maxWidth='md'>
      <h1 className='text-center text-2xl py-4'>{ serie.name }</h1>
      <Image
        src={ serie.imgURL }
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
        <div className='grid grid-cols-2 hover:bg-accent mb-4'>
          <p className='border border-strokeLight border-solid px-2'>Géneros</p>
          <p className='border border-strokeLight border-solid px-2'>{serie.genre.join(', ')}</p>
        </div>
        <h2 className='text-center text-2xl mb-4'>Lista de volúmenes</h2>
        {
          <CardGrid gridCols='sm:grid-cols-1 md:grid-cols-2'>
            <CardManga />
            <CardManga />
            <CardManga />
            <CardManga />
          </CardGrid>
        }
      </div>
    </AppLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  return {
    paths: [
      {
        params: {
          name: ''
        }
      }
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const serie = series[0]

  return {
    props: {
      serie
    }
  }
}

export default SeriePage
