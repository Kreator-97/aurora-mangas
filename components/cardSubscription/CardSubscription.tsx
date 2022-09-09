import Image from 'next/image'
import { FC } from 'react'
import { Subscription } from '../../interfaces'
import { formatPrice } from '../../util'
import { CustomRow } from '../customRow'

interface Props {
  subscription: Subscription;
  onDeleteSuscription: () => void;
}

export const CardSubscription: FC<Props> = ({subscription, onDeleteSuscription}) => {
  return (
    <div className='bg-darkTransparent' key={subscription.id}>
      <Image
        src={ subscription.serie.imgURL }
        layout="responsive"
        width={320}
        height={180}
        className="rounded-t object-cover"
      />
      <div className='rounded p-2'>
        <h2 className='text-center text-xl mb-2'>Suscripción</h2>
        <CustomRow
          name={'Serie'}
          value={subscription.serie.name}
          margin={0}
        />
        <CustomRow
          margin={0}
          name={'Periodicidad'}
          value={subscription.serie.periodicy}
        />
        <CustomRow
          margin={0}
          name={'Precio'}
          value={formatPrice(subscription.serie.unitPrice)}
        />
        <CustomRow
          margin={0}
          name={'Estado'}
          value={subscription.status}
        />
        {
          subscription.status === 'ACTIVE' && (
            <button
              className='bg-error btn w-full my-2'
              onClick={() => onDeleteSuscription() }
            >Cancelar suscripción</button>
          )
        }
      </div>
    </div>
  )
}

