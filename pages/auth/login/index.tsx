import { FormEvent } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowSmLeft } from 'react-icons/hi'
import { getSession, signIn } from 'next-auth/react'

import { useForm } from '../../../hooks'

const LoginPage = () => {
  const router = useRouter()
  const { email, password, onInputChange } = useForm({
    email: '',
    password: '',
  })

  const onGoogleSignIn = () => {
    try {
      signIn('google')
    } catch(error) {
      console.log(error)
    }
  }

  const onSubmit = (e:FormEvent) => {
    e.preventDefault()
    const required = [email, password]
    if( required.some( value => value.trim() === '' || !value) ) return

    signIn('credentials', { email, password })
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen flex items-center md:w-1/2">

      <form
        className="bg-light bg-opacity-90 w-full p-4 h-screen sm:h-fit" onSubmit={ onSubmit }
        data-testid="form-login"
      >
        <div className='flex justify-between mb-2'>
          <HiArrowSmLeft fill='#444' size={28} cursor="pointer" onClick={ () => router.back() }/>
          <h1 className="text-2xl text-center text-dark">Iniciar sesión</h1>
          <div className='w-7'></div>
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
            />
          </label>
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
              data-testid="password"
            />
          </label>
        </div>
        <button
          className='btn bg-accent hover:bg-accentDark w-full mb-2'
          type="submit"
        >Iniciar sesión</button>
        
        <h2 className="text-center text-lg text-dark mb-2">Inicia sesión con tu cuenta Google:</h2>
        <div className='flex justify-center mb-4'>
          <FcGoogle
            size={48}
            cursor="pointer"
            onClick={() => onGoogleSignIn() }
            data-testid="google-icon"
          />
        </div>

        <Link href={'/auth/register'} passHref>
          <a className='block text-center btn bg-accent hover:bg-accentDark w-full ghost'>
          ¿No tienes cuenta?, Registrate fácilmente
          </a>
        </Link>
      </form>
    </div>
  )
}

export default LoginPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if( session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
