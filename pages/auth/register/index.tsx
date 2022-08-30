import { FormEvent, useState } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowSmLeft } from 'react-icons/hi'
import { Toaster, toast } from 'react-hot-toast'
import { useMutation } from '@apollo/client'

import { useForm } from '../../../hooks'
import { CREATE_USER } from '../../../graphql/client'

const validations = {
  email: {
    validation: (value:string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(value),
    message: 'Este campo es requerido'
  },
  password: {
    validation: (value:string) => value.length > 5,
    message: 'La contraseña debe de tener 6 o más caracteres'
  },
  name: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo es requerido'
  }
}

const RegisterPage = () => {
  const router = useRouter()
  const { email, password, name, onInputChange, errors } = useForm({
    email: '',
    password: '',
    name: '',
  }, validations)

  const [ showErrors, setShowErrors] = useState(false)
  const [ createUser ] = useMutation(CREATE_USER)

  const onGoogleSignIn = async () => {
    try {
      signIn('google')
    } catch (error) {
      console.log(error)
    } 
  }

  const onSubmit = async (e:FormEvent) => {
    e.preventDefault()

    if ( Object.values( errors).some( (value) => value !== null ) ) {
      setShowErrors(true)
      return
    }
    
    try {
      const { data } = await createUser({ variables: {
        email, password, fullname: name,
      }})

      if( !data.createUser.ok ) {
        throw new Error(data.createUser.message)
      }

      toast.success(data.createUser.message)
      await signIn('credentials', { email, password } )
    } catch(error) {
      console.error(error)
      toast.error((error as {message: string}).message)
    }
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen flex items-center md:w-1/2">

      <form
        className="bg-light bg-opacity-90 w-full p-4 h-screen sm:h-fit"
        onSubmit={ onSubmit}
        data-testid="form-register"
      >

        <div className='flex justify-between mb-2'>
          <HiArrowSmLeft fill='#444' size={28} cursor="pointer" onClick={ () => router.back() }/>
          <h1 className="text-2xl text-center text-dark">Crear cuenta</h1>
          <div className='w-7'></div>
        </div>

        <div className='mb-2'>
          <label htmlFor="name" className="text-dark">
          Ingresa tu nombre completo:
            <input
              className="w-full bg-light bg-opacity-80 px-4 py-2 text-dark border border-stroke border-solid focus:outline-none mb-2"
              placeholder="Nombre completo"
              type="text"
              name="name"
              value={ name }
              onChange={ onInputChange }
              data-testid="input-name"
            />
          </label>
          { (errors.name && showErrors) && (<p className='text-error text-sm'>{errors.name}</p>)}
        </div>

        <div className='mb-2'>
          <label htmlFor="email" className="text-dark">
          Ingresa tu correo electrónico:
            <input
              className="w-full bg-light bg-opacity-80 px-4 py-2 text-dark border border-stroke border-solid focus:outline-none mb-2"
              placeholder="Correo electrónico"
              type="email"
              name="email"
              value={ email }
              onChange={ onInputChange }
              data-testid="input-email"
            />
          </label>
          { (errors.email && showErrors)&& (<p className='text-error text-sm'>{errors.email}</p>)}
        </div>

        <div className='mb-2'>
          <label htmlFor="password" className="text-dark">
          Ingresa tu contraseña:
            <input
              className="w-full bg-light bg-opacity-80 px-4 py-2 text-dark border border-stroke border-solid focus:outline-none mb-2"
              placeholder="Contraseña"
              type="password"
              name="password"
              value={ password }
              onChange={ onInputChange }
              data-testid="input-password"
            />
          </label>
          { (errors.password && showErrors) && (<p className='text-error text-sm'>{errors.password}</p>)}
        </div>
        <button
          className='btn bg-accent hover:bg-accentDark w-full mb-2'
          type="submit"
        >
         Crear cuenta
        </button>
        
        <h2 className="text-center text-lg text-dark mb-2">Inicia sesión con tu cuenta Google:</h2>
        <div className='flex justify-center mb-4'>
          <FcGoogle
            size={48}
            cursor="pointer"
            onClick={() => onGoogleSignIn() }
            data-testid="google-signin"
          />
        </div>

        <Link href={'/auth/login'} passHref>
          <a className='block text-center btn bg-accent hover:bg-accentDark w-full ghost'>
          ¿Ya tienes cuenta?, Inicia sesión
          </a>
        </Link>
        <Toaster position='top-center'/>
      </form>
    </div>
  )
}

export default RegisterPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if( session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
