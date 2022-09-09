import { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { toast, Toaster } from 'react-hot-toast'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

import { CardSubscription, Modal } from '../../components'
import { dbSubscriptions } from '../../database'
import { Response, Subscription, SubscriptionStatus } from '../../interfaces'
import { AppLayout } from '../../layouts'
import { CANCEL_SUBSCRIPTION } from '../../graphql/client'
5
interface Props {
  subscriptions: Subscription[]
}

const SubscriptionsPage: NextPage<Props> = ({subscriptions}) => {
  const [ cancelSubscription ] = useMutation(CANCEL_SUBSCRIPTION)
  const router = useRouter()

  const [ openModal, setOpenModal ] = useState(false)
  const [ subscriptionType, setSubscriptionType] = useState<SubscriptionStatus>('ACTIVE')
  const [ subscriptionIdToCancel, setSubscriptionIdToCancel ] = useState<string | null>(null)

  const subscriptionsActive = subscriptions.filter( subscription => subscription.status === 'ACTIVE' )
  const subscriptionsCancelled = subscriptions.filter( subscription => subscription.status === 'CANCELLED' )

  const onCancelSuscription = async () => {
    setOpenModal(false)

    try {
      const { data } = await cancelSubscription({
        variables: {
          subscriptionID: subscriptionIdToCancel
        }
      })
      
      const { message, ok, error } = data.cancelSubscription as Response
      if( !ok ) {
        console.error(error)
        throw new Error(message)
      }
      toast.success(message)
      setTimeout(() => {
        router.reload()
      }, 2000)
    } catch (error:any) {
      toast.error(error.message)
    }
  }

  return (
    <AppLayout title="Suscripciones" maxWidth='lg'>
      <div className='px-2'>
        <h1 className="title">Suscripciones</h1>
        <div className='flex gap-2'>
          <button
            className={`btn ${subscriptionType === 'ACTIVE' ? 'bg-accent' : 'ghost'}`}
            onClick={() => setSubscriptionType('ACTIVE') }
          >
          Activas
          </button>
          <button
            className={`btn ${subscriptionType === 'CANCELLED' ? 'bg-accent' : 'ghost'}`}
            onClick={() => setSubscriptionType('CANCELLED') }
          >
          Canceladas
          </button>
        </div>
        {
          (subscriptionsActive.length === 0) && (subscriptionType === 'ACTIVE') && 
          (<p className='bg-accent text-center mt-4'>No existen suscripciones activas</p>)
        }
        {
          (subscriptionType === 'ACTIVE') &&
            <section className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
              {
                subscriptionsActive.map((subscription) => (
                  <CardSubscription
                    key={subscription.id}
                    subscription={subscription}
                    onDeleteSuscription={ () => { setOpenModal(true); setSubscriptionIdToCancel(subscription.id) }}
                  />
                ))
              }
            </section>
        }
        {
          (subscriptionsCancelled.length === 0) && (subscriptionType === 'CANCELLED') &&
          (<p className='bg-accent text-center mt-4'>No existen suscripciones canceladas</p>)
        }
        {
          <section className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
            {
              (subscriptionType === 'CANCELLED') &&
              subscriptionsCancelled.map((subscription) => (
                <CardSubscription
                  key={subscription.id}
                  subscription={subscription}
                  onDeleteSuscription={ () => { setOpenModal(true); setSubscriptionIdToCancel(subscription.id) }}
                />
              ))
            }
          </section>
        }
        <Modal
          title='¿Está seguro de cancelar la suscripción?'
          isOpen={openModal}
          onClose={ () => {
            setOpenModal(false); setSubscriptionIdToCancel(null)
          }}
        >
          <p className='text-alert text-sm text-center mt-2'>Si cancelas esta suscripción ya no podrás suscribirte de nuevo</p>
          <p className='text-alert text-sm text-center mb-2'>Todavía podrás conseguir tus mangas por separados</p>
          <div className='flex flex-col'>
            <button
              className='btn bg-success mb-2'
              onClick={() => {
                setOpenModal(false); setSubscriptionIdToCancel(null)}
              }
            >Conservar suscripción</button>
            <button
              className='btn bg-error'
              onClick={() => onCancelSuscription() }
            >Cancelar suscripción</button>
          </div>
        </Modal>
      </div>
      <Toaster position='top-center'/>
    </AppLayout>
  )
}

export default SubscriptionsPage

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const subscriptions = await dbSubscriptions.getSubscriptionsByUserId(session.user.id)

  return {
    props: { subscriptions }
  }
}
