import { ChangeEvent, useState } from 'react'

export function useForm<T> (initialValue: T) {
  const [ formState, setFormState ] = useState<T>(initialValue)
  
  const onInputChange = ({target}:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const onResetForm = () => {
    setFormState(initialValue)
  }

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm
  }
}
