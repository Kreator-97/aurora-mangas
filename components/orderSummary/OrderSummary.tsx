import { FC } from 'react'
import Image from 'next/image'

import { CustomRow } from '../customRow'
import { formatPrice } from '../../util'
import { Order } from '../../interfaces'

interface Props {
  order: Order;
}

export const OrderSummary:FC<Props> = ({order}) => {
  return (
    <div className='flex flex-col gap-4 my-4 max-w-[520px] mx-auto'>
      {
        order.items.map((item) => {
          const { product } = item
          return (
            <div
              key={product.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                gap: '1rem',
                backgroundColor: 'var(--dark-transparent)',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              <div className='flex flex-col items-center'>
                <Image src={ product.imgURL } layout='fixed' width={150} height={225} />
              </div>
              <div>
                <CustomRow name={'Nombre'} value={`${product.serie.name } #${product.number}`}/>
                <CustomRow name={'Cantidad'} value={item.amount}/>
                <CustomRow name={'Precio unitario'} value={ formatPrice(product.price) }/>
                <CustomRow name={'Publicación'} value={product.published}/>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
