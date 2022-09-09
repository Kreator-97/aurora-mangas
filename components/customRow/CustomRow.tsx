import { FC } from 'react'

interface Props {
  value: string | number;
  name: string | number;
  margin?: number;
}

export const CustomRow: FC<Props> = ({value, name, margin = 2}) => {
  return (
    <div className={`grid grid-cols-2 mb-${margin} hover:bg-accent`}>
      <p className='border border-strokeLight border-solid px-2'>{name}</p>
      <p className='border border-strokeLight border-solid px-2'>{value}</p>
    </div>
  )
}
