import { FC } from 'react'

interface Props {
  value: string | number;
  name: string | number;
}

export const CustomRow: FC<Props> = ({value, name}) => {
  return (
    <div className='grid grid-cols-2 mb-2 hover:bg-accent'>
      <p className='border border-strokeLight border-solid px-2'>{name}</p>
      <p className='border border-strokeLight border-solid px-2'>{value}</p>
    </div>
  )
}
