import { FC } from 'react'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'

import { useCounter } from '../../hooks'

interface Props {
  initial: number;
  id?: string;
  onIncrement?: (amount:number, id:string) => void;
  onDecrement?: (amount:number, id:string) => void;
}

// TODO: this function should to return the new counter on a event named onChangeAmount, then remove both onIncrement and onDecrement
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
          <HiOutlineMinusCircle
            size={28}
            cursor="pointer"
            onClick={() => onDecrementEvent(1) }
            data-testid={'decrement-icon'}
          />
        </div>
        <div
          className='font-medium text-2xl px-2'
          data-testid={'amount-box'}
        >{ counter }
        </div>
        <div>
          <HiOutlinePlusCircle
            size={28}
            cursor="pointer"
            onClick={() => onIncrementEvent(1) }
            data-testid={'increment-icon'}
          />
        </div>
      </div>
    </div>
  )
}
