import { useRouter } from 'next/router'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowSmLeft } from 'react-icons/hi'

const RegisterPage = () => {
  const router = useRouter()

  const onGoogleSignIn = () => {
    console.log('Hay que realizar el signin con google')
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen flex items-center md:w-1/2">

      <div className="bg-light bg-opacity-90 w-full p-4 h-screen sm:h-fit">
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
            />
          </label>
        </div>

        <div className='mb-2'>
          <label htmlFor="email" className="text-dark">
          Ingresa tu correo electrónico:
            <input
              className="w-full bg-light bg-opacity-80 px-4 py-2 text-dark border border-stroke border-solid focus:outline-none mb-2"
              placeholder="Correo electrónico"
              type="email"
              name="email"
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
            />
          </label>
        </div>
        
        <h2 className="text-center text-lg text-dark mb-2">Inicia sesión con tu cuenta Google:</h2>
        <div className='flex justify-center mb-4'>
          <FcGoogle size={48} cursor="pointer" onClick={() => onGoogleSignIn() } />
        </div>

        <button
          className='btn bg-accent hover:bg-accentDark w-full'
          onClick={ () => router.push('/auth/login') }
        >¿Ya tienes cuenta?, Inicia sesión</button>
    
      </div>
    </div>
  )
}

export default RegisterPage
