import { useState } from 'react'

interface Props {
  initial?: number;
  minValue?: number;
}

export const useCounter = ({initial = 0, minValue }:Props) => {
  const [ counter, setCounter] = useState(initial)

  const increment = (factor:number) => {
    setCounter(counter + factor)
  }

  const decrement = (factor:number) => {
    if ( minValue !== undefined ) {
      const max = Math.max(minValue, counter-factor)
      setCounter(max)
      return
    }
    setCounter(counter - factor)
  }

  const reset = () => setCounter(initial)

  return { increment, decrement, reset, counter }
}
