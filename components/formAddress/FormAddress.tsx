import { FC, FormEvent, useState } from 'react'
import { useForm } from '../../hooks'

interface Props {
  onSubmit?(form: FormAddress): void;
  address?: FormAddress;
}

const noEmptyString = (s:string) => s.trim() !== ''
const message = 'Este campo es requerido'

const formValidations = {
  state: {
    validation: noEmptyString,
    message,
  },
  city: {
    validation: noEmptyString,
    message,
  },
  col: {
    validation: noEmptyString,
    message,
  },
  number: {
    validation: noEmptyString,
    message,
  },
  cp: {
    validation: noEmptyString,
    message,
  },
}

export interface FormAddress {
  state : string;
  city  : string;
  col   : string;
  number: string;
  cp    : string;
}

export const FormAddress:FC<Props> = ({onSubmit, address}) => {
  const { city, col, cp, state, number, onInputChange, formState, errors} = useForm({
    state : address?.state  || '',
    city  : address?.city   || '',
    col   : address?.col    || '',
    number: address?.number || '',
    cp    : address?.cp     || '',
  }, formValidations )

  const [ showErrors, setShowErrors ] = useState(false)
  

  const onSubmitEvent = (e:FormEvent) => {
    e.preventDefault()
    
    if ( Object.values(errors).some((error) => error !== null ) ) {
      setShowErrors(true)
      return
    }

    onSubmit && onSubmit(formState)
  }

  return (
    <form
      className='mt-2 mb-8'
      onSubmit={ onSubmitEvent }
    >
      <h2 className='text-xl text-center'>Verifica tu dirección de entrega</h2>

      <div className='flex flex-col mb-4'>
        <label htmlFor="state">
          Estado:
        </label>
        <input
          className='input text-dark'
          type="text"
          name='state'
          value={ state }
          onChange={ onInputChange }
        />
        { (errors.state && showErrors) && (<p className='text-error mt-2'>{errors.state}</p>)}
      </div>

      <div className='flex flex-col mb-4'>
        <label htmlFor="city">
          Ciudad:
        </label>
        <input
          className='input text-dark'
          type="text"
          name='city'
          value={ city }
          onChange={ onInputChange }
        />
        { (errors.city && showErrors) && (<p className='text-error mt-2'>{errors.city}</p>)}
      </div>

      <div className='flex flex-col mb-4'>
        <label htmlFor="col">
          Colonia:
        </label>
        <input
          className='input text-dark'
          type="text"
          name='col'
          value={ col }
          onChange={ onInputChange }
        />
        { (errors.col && showErrors) && (<p className='text-error mt-2'>{errors.col}</p>)}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col mb-4'>
          <label htmlFor="number">
              Numero de domicilio:
          </label>
          <input
            className='input text-dark'
            type="text"
            name='number'
            value={ number }
            onChange={ onInputChange }
          />
          { (errors.number && showErrors) && (<p className='text-error mt-2'>{errors.number}</p>)}
        </div>

        <div className='flex flex-col mb-4'>
          <label htmlFor="cp">
              Código postal:
          </label>
          <input
            className='input text-dark'
            type="text"
            name='cp'
            value={ cp }
            onChange={ onInputChange }
          />
          { (errors.cp && showErrors) && (<p className='text-error mt-2'>{errors.cp}</p>)}

        </div>
      </div>

      <button className='btn bg-accent w-full'>Guardar dirección</button>
    </form>
  )
}
