import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { HiX } from 'react-icons/hi'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { close } from '../../app/slices/uiSlice'

export const Sidebar = () => {
  const isSidebarOpen = useAppSelector( (state) => state.ui.isSidebarOpen)
  const dispatch = useAppDispatch()
  const auth = useAppSelector( state => state.auth)
  const router = useRouter()

  const user = auth.user
  const closeSideBar = () => {
    dispatch(close())
  }

  const navigateTo = (url:string) => {
    closeSideBar()
    router.push(url)
  }

  return (
    <div className={`min-h-screen max-w-[360px] bg-dark fixed top-0 left-0 w-full z-50 p-4 transition-transform ${ isSidebarOpen ? '' : '-translate-x-full'}`}>
      <div className='flex justify-between items-center mb-2'>
        <div className='w-8'></div>
        <h2 className='text-2xl'>{ user?.fullname ? user.fullname : 'Bienvenido' }</h2>
        <HiX
          className='cursor-pointer'
          size={32}
          onClick={ () => closeSideBar() }
        />
      </div>
      {
        auth.isLogged
          ? (<>
            <div className='flex gap-2 mb-4'>
              <button
                className='text-alert w-full'
                onClick={ () => signOut() }
              >Cerrar sesión</button>
            </div>
          </>)
          : (<>
            <p className='text-center mb-2'>Ingresa para gestionar tu cuenta</p>
            <div className='flex gap-2 mb-4'>
              <button className='btn bg-accent w-full' onClick={ () => navigateTo('/auth/login') }>Ingresar</button>
              <button className='btn ghost w-full' onClick={() => navigateTo('/auth/register')}>Crear cuenta</button>
            </div>
          </>)
      }
      <hr />
      <section>
        <button
          className='text-xl py-2 hover:text-accent cursor-pointer block'
        >
          Listar por géneros
        </button>
        <button
          className='text-xl py-2 hover:text-accent cursor-pointer block'
        >
          Lista de deseos
        </button>
        <button
          className='text-xl py-2 hover:text-accent cursor-pointer block'
        >
          Más vendidos
        </button>
      </section>
      {
        auth.isLogged && (
          <>
            <hr />
            <section>
              <p className='text-xl text-center pt-2'>Sobre tu cuenta</p>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
              >
            Lista de pedidos
              </button>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
              >
            Datos personales
              </button>
            </section>
          </>)
      }
      {
        auth.user?.role === 'ADMIN' && (
          <>
            <hr />
            <section>
              <p className='text-xl text-center pt-2'>Administrador</p>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
                onClick={ () => navigateTo('/admin/orders') }
              >
                Ver pedidos realizados
              </button>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
                onClick={ () => navigateTo('/admin/series') }
              >
                Series
              </button>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
                onClick={ () => navigateTo('/admin/mangas') }
              >
                Mangas
              </button>
              <button
                className='text-xl py-2 hover:text-accent cursor-pointer block'
                onClick={ () => navigateTo('/admin/authors') }
              >
                Autores
              </button>
            </section>
          </>
        )
      }
    </div>
  )
}
