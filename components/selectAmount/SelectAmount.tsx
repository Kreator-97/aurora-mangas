import { FC } from 'react'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'

import { useCounter } from '../../hooks'

interface Props {
  initial: number;
  id?: string;
  onIncrement?: (amount:number, id:string) => void;
  onDecrement?: (amount:number, id:string) => void;
}

export const SelectAmount:FC<Props> = ({initial ,onIncrement, onDecrement, id}) => {
  const { counter, increment, decrement } = useCounter({initial, minValue: 1})

  const onDecrementEvent = (value:number) => {
    decrement(value)
    onDecrement && onDecrement(counter-value, id || '')
  }
  const onIncrementEvent = (value:number) => {
    increment(value)
    onIncrement && onIncrement(counter+value, id || '')
  }

  return (
    <div>
      <h2 className='text-lg mb-2 text-center'>Seleccione la cantidad</h2>

      <div className='flex gap-4 mb-2 justify-center'>
        <div>
          <HiOutlineMinusCircle size={28} cursor="pointer" onClick={() => onDecrementEvent(1) }/>
        </div>
        <div className='font-medium text-2xl px-2'>{ counter }</div>
        <div>
          <HiOutlinePlusCircle size={28} cursor="pointer" onClick={() => onIncrementEvent(1) }/>
        </div>
      </div>
    </div>
  )
}
