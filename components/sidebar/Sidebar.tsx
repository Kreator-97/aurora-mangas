import { HiX } from 'react-icons/hi'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { close } from '../../app/slices/uiSlice'

export const Sidebar = () => {
  const isSidebarOpen = useAppSelector( (state) => state.ui.isSidebarOpen)
  const dispatch = useAppDispatch()

  const closeSideBar = () => {
    dispatch(close())
  }
  return (
    <div className={`min-h-screen max-w-[360px] bg-dark fixed top-0 left-0 w-full z-50 p-4 transition-transform ${ isSidebarOpen ? '' : '-translate-x-full'}`}>
      <div className='flex justify-between items-center'>
        <div className='w-8'></div>
        <h2 className='text-2xl'>Bienvenido</h2>
        <HiX
          className='cursor-pointer'
          size={32}
          onClick={ () => closeSideBar() }
        />
      </div>
      <p className='text-center mb-2'>Ingresa para gestionar tu cuenta</p>
      <div className='flex gap-2 mb-4'>
        <button className='btn bg-accent w-full'>Ingresar</button>
        <button className='btn ghost w-full'>Crear cuenta</button>
      </div>
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
    </div>
  )
}
