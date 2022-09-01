import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'
import { Sidebar } from '../../../components/sidebar/Sidebar'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { signOut } from 'next-auth/react'

jest.mock('../../../app/hooks')
jest.mock('next-auth/react')

const dispatch = jest.fn()

describe('tests on Sidebar component', () => {

  test('should to match with snapshot', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      ui: { isSidebarOpen: true },
      auth: { isLogged: false, user: null },
    })

    const { container } = render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    )
    expect(container).toMatchSnapshot()
    expect(screen.getByText('Bienvenido')).toBeInTheDocument
    expect(screen.getByText('Ingresa para gestionar tu cuenta')).toBeInTheDocument
    expect(screen.getByText('Ingresar')).toBeInTheDocument
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument
  })
  
  test('should to show username on sidebar when is authenticated', () => {
    const fullname = 'Adrian gomez';
    (useAppSelector as jest.Mock).mockReturnValue({
      ui: { isSidebarOpen: true },
      auth: { isLogged: true, user: { fullname } },
    })
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    )

    expect(screen.getByText(fullname)).toBeInTheDocument
  })

  test('should to dispatch closeSideBar()', () => {

    (useAppSelector as jest.Mock).mockReturnValue({
      ui: { isSidebarOpen: true },
      auth: { isLogged: true, user: null },
    });

    (useAppDispatch as jest.Mock).mockReturnValue(dispatch)
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    )

    const closeIcon = screen.getByTestId('close-icon')
    fireEvent.click(closeIcon)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined, type: 'ui/closeSidebar',
    })

  })

  test('should to call signOut()', () => {
    (signOut as jest.Mock).mockReturnValue(() => {})

    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    )

    const btnSignOut = screen.getByTestId('signout')
    fireEvent.click( btnSignOut )

    expect(signOut).toHaveBeenCalled()
  })
})
