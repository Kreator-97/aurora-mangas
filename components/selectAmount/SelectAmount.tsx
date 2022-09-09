import { FC, useState } from 'react'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'

interface Props {
  initial: number;
  id?: string;
  minValue?: number;
  maxValue?: number;
  onChangeAmount?: (amount:number, id:string) => void;
}

export const SelectAmount:FC<Props> = ({initial, id = '', onChangeAmount, minValue = 1, maxValue = Infinity}) => {
  const [ counter, setCounter] = useState(initial)

  const onChangeAmountEvent = (value: number, type: 'decrement' | 'increment') => {
    if( type === 'decrement' ) {
      const newValue = Math.max(minValue, counter-value)
      setCounter(newValue)
      onChangeAmount && onChangeAmount(newValue, id)
      return
    }
    
    if( type === 'increment' ) {
      const newValue = Math.min(maxValue, counter+value)
      setCounter(newValue)
      onChangeAmount && onChangeAmount(newValue, id)
      return
    }
  }

  return (
    <div>
      <h2 className='text-lg mb-2 text-center'>Seleccione la cantidad</h2>

      <div className='flex gap-4 mb-2 justify-center'>
        <div>
          <HiOutlineMinusCircle
            size={28}
            cursor="pointer"
            onClick={() => onChangeAmountEvent(1, 'decrement') }
            data-testid={'decrement-icon'}
            strokeWidth={2}
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
            onClick={() => onChangeAmountEvent(1, 'increment') }
            data-testid={'increment-icon'}
          />
        </div>
      </div>
    </div>
  )
}
