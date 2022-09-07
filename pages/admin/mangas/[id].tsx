import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'

import { AppLayout } from '../../../layouts'
import { dbItems, dbMangas, dbUsers } from '../../../database'
import { CustomRow } from '../../../components'
import { Manga } from '../../../interfaces'
import { formatPrice } from '../../../util'

interface Props {
  manga: Manga & { soldUnits: number }
}

const MangaDetailsPage:NextPage<Props> = ({manga}) => {
  return (
    <AppLayout title="Detalles">
      <div className='py-2'>
        <h1 className='title mb-4'>Detalles del producto</h1>
        <div
          className='mx-auto gap-4'
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            maxWidth: '600px',
          }}>
          <div>
            <Image src={manga.imgURL} layout="fixed" width={200} height={300} />
          </div>
          <div>
            <CustomRow name={'Titulo'} value={manga.title} />
            <CustomRow name={'Serie'} value={ manga.serie.name } />
            <CustomRow name={'Número'} value={ manga.number } />
            <CustomRow name={'Publicado'} value={ manga.published } />
            <CustomRow name={'Precio'} value={ formatPrice(manga.price) } />
            <CustomRow name={'Stock'} value={ manga.stock } />
            <CustomRow name={'Unidades vendidas'} value={ manga.soldUnits } />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default MangaDetailsPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const session = await getSession(ctx)

  if( !session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const isValid = await dbUsers.validateRole(session.user.id, ['ADMIN'])
  if( !isValid ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const id = ctx.query.id?.toString()

  const manga = await dbMangas.getMangaById(id || '')
  const soldUnits = await dbItems.getSoldUnitsByMangaId(id || '')

  return {
    props: {
      manga: {
        ...manga,
        soldUnits
      }
    }
  }
}
