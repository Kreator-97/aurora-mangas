import { ChangeEvent, useEffect, useMemo, useState } from 'react'

type FormValidationType = {
  [key: string]: {
    validation: (value:string) => boolean,
    message: string;
  }
}

type Errors = {
  [key: string]: string | null;
}

export function useForm<T> (initialValue: T, formValidations:FormValidationType = {}) {
  const [ formState, setFormState ] = useState<T>(initialValue)
  const [ errors, setErrors ] = useState<Errors>({})
  
  useEffect(() => {
    createValidators()
  }, [formState])

  const onInputChange = ({target}:ChangeEvent<HTMLInputElement | HTMLSelectElement  >) => {
    const {name, value} = target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const onResetForm = () => {
    setFormState(initialValue)
  }

  const isFormValid:boolean = useMemo(() => {
    const errorKeys = Object.keys( errors )
    
    for( const key of errorKeys ) {
      if( errors[key] !== null ) return false
    }

    return true
  }, [errors])

  const createValidators = () => {
    const formCheckedValues: {[key:string]: string | null} = {}

    for( const field of Object.keys(formValidations)) {
      const { validation: validationFn, message } = formValidations[field]
      const currentStateValue = (formState as unknown as { [key: string]: string })[field]
      formCheckedValues[field] = validationFn( currentStateValue) ? null : message
    }

    setErrors( formCheckedValues )
  }

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    errors,
    isFormValid,
  }
}

