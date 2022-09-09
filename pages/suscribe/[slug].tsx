import { NextPage, GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { useMutation } from '@apollo/client'
import { Toaster, toast } from 'react-hot-toast'

import { AppLayout } from '../../layouts'
import { CREATE_SUBSCRIPTION } from '../../graphql/client'
import { CustomRow } from '../../components'
import { dbSeries } from '../../database'
import { formatPrice } from '../../util'
import { Response } from '../../interfaces/graphql'
import { Serie } from '../../interfaces'

interface Props {
  serie: Serie;
}

const SuscribeSeriePage: NextPage<Props> = ({serie}) => {
  const [ createSubscription ] = useMutation(CREATE_SUBSCRIPTION)
  const router = useRouter()

  const onSuscriptionCompleted = async (subscriptionID: string) => {
    try {
      const { data } = await createSubscription({
        variables: {
          paypalSubscriptionID: subscriptionID,
          serieId: serie.id,
        }
      })

      const { ok, message, error } = data.createSubscription as Response
      if( !ok ) {
        console.error(error)
        throw new Error(message)
      }

      toast.success(message)
      setTimeout(() => {
        // TODO: redireccionar a la página de suscripciones
        router.push('/')
      }, 2000)
    } catch (error:any) {
      toast.error(error.message)
    }
  }

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
        <CustomRow name={'Nombre'} value={serie.name}/>
        <CustomRow name={'Autor'} value={serie.author.name}/>
        <CustomRow name={'Periodicidad'} value={serie.periodicy} />
        <CustomRow name={'Géneros'} value={serie.genre} />
        <CustomRow name={'Volumenes totales'} value={serie.totalVolumes}/>
        <CustomRow name={'Estado de la obra'} value={serie.finished ? 'Finalizado' : 'En progreso'}/>
      </div>
      
      <section className='p-4 flex flex-col gap-y-2 items-center max-w-screen-sm mx-auto'>
        <p className='text-base text-success text-center'>
          Suscríbete y obtén todos los volúmenes en su fecha de publicación sin costo por envío
        </p>
        { 
          serie.unitPrice
            ? `Suscribete por ${formatPrice(serie.unitPrice)}`
            : 'Suscribete proximamente'
        }
        {
          (serie.paypalPlanId !== undefined) && (
            <PayPalButtons
              style={{
                shape: 'rect',
                color: 'blue',
                layout: 'vertical',
                label: 'subscribe'
              }}
              createSubscription={ function(data, actions) {
                return actions.subscription.create({
                  // Creates the subscription
                  plan_id: serie.paypalPlanId!,
                })
              }}
              onApprove={ async function(data, actions) {
                onSuscriptionCompleted(data.subscriptionID!)
              }}
            />
          )
        }
        <Toaster position='top-center' />
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
