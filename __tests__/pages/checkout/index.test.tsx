import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { store } from '../../../app/store'
import { default as CheckoutPage } from '../../../pages/checkout'
import { mangas, users } from '../../fixtures/db'
import { MockedProvider } from '@apollo/client/testing'

// mocks
import { useSession } from 'next-auth/react'
import { useAppSelector } from '../../../app/hooks'

jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter: () => ({ query: { q: '' } })
  }
})
jest.mock('../../../components/sidebar/Sidebar')
jest.mock('../../../app/hooks')

describe('tests on Checkout Page', () => {
  (useSession as jest.Mock).mockReturnValue(() => {
    return {
      status: 'authenticated',
      data: users[0],
    }
  })

  test('should to match with snapshot', () => {
    (useAppSelector as jest.Mock).mockReturnValue(({
      cart: { items: [{ product: mangas[0], amount: 1 }], total: mangas[0].price }
    }).cart)

    const session = {
      status : 'authenticated',
      user : users[0],
      expires: '0'
    }

    const { container } = render(
      <MockedProvider mocks={[]}>
        <Provider store={store} >
          <CheckoutPage user={ session }/>
        </Provider>
      </MockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('should to show message when there are not items on cart', () => {
    (useAppSelector as jest.Mock).mockReturnValue(({
      cart: {
        items: [],
        total: 0
      },
    }).cart)

    render(
      <MockedProvider>
        <Provider store={store}>
          <CheckoutPage user={ null }/>
        </Provider>
      </MockedProvider>
    )
    const message = screen.getByText('No tienes elementos en el carrito de compras')
    expect(message).toBeInTheDocument
  })

  test('should to show login button when user is not authenticated', () => {
    (useAppSelector as jest.Mock).mockReturnValue(({
      cart: { items: [{ product: mangas[0], amount: 1 }], total: mangas[0].price }
    }).cart)

    render(
      <MockedProvider>
        <Provider store={store}>
          <CheckoutPage user={ null }/>
        </Provider>
      </MockedProvider>
    )
    
    expect( screen.getByText('Iniciar sesión') ).toBeInTheDocument
  })

  test('"Confirmar pedido" button should to be active when user is logged and exists items on cart', () => {

    (useAppSelector as jest.Mock).mockReturnValue(({
      cart: { items: [{ product: mangas[0], amount: 1 }], total: mangas[0].price }
    }).cart)

    const session = {
      status : 'authenticated',
      user : users[0],
      expires: '0'
    }

    render(
      <MockedProvider>
        <Provider store={store} >
          <CheckoutPage user={ session }/>
        </Provider>
      </MockedProvider>
    )

    const confirm = screen.getByText('Confirmar pedido')
    expect(confirm.getAttributeNames()).not.toContain('disabled')
  })
})
