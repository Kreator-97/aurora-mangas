import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { mangas } from '../../fixtures/db'
import { store } from '../../../app/store'

const id = '001'

// mocks modules
import { removeItem } from '../../../app/slices/shoppingCartSlice'
import { closeShoppingCart } from '../../../app/slices/uiSlice'
import { ShoppingCart } from '../../../components/shoppingCart/ShoppingCart'
import { useRouter } from 'next/router'

jest.mock('../../../app/slices/uiSlice', () => {
  return {
    closeShoppingCart: jest.fn().mockReturnValue({payload: undefined, type: 'ui/closeShoppingCart'}),
  }
})

jest.mock('../../../app/slices/shoppingCartSlice', () => {
  return {
    removeItem: jest.fn().mockReturnValue({type: 'shoppingCart/removeItem', payload: { id: '001' }})
  }
})

jest.mock('../../../app/hooks', () => {
  const original = jest.requireActual('../../../app/hooks')
  return {
    ...original,
    useAppSelector: ((cart:any) => ({
      cart: { items: [{amount: 1, product: {...mangas[0], id}}], total: 0}}).cart),
  }
})

const router = { push: jest.fn() }
jest.mock('next/router', () => ({
  useRouter: () => (router)
}))

describe('test on shoppingCart component', () => {
  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    )
    expect(container).toMatchSnapshot()
    expect(screen.getByText('Carrito de compra')).toBeInTheDocument
    expect(screen.getByText(/Total global/)).toBeInTheDocument
    expect(screen.getByText('Ir al resumen')).toBeInTheDocument
  })

  test('onRemove function should to be called', () => {
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    )
    
    const closeIcon = screen.getByTestId('close-shopping-cart-icon')
    fireEvent.click(closeIcon)
    expect(closeShoppingCart).toHaveBeenCalled()
  })

  test('onRemove function should to be called with id to remove', () => {
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    )

    const btnRemove = screen.getByText('Eliminar del carrito')
    fireEvent.click(btnRemove)
    
    expect( removeItem ).toHaveBeenCalledWith({id})
  })

  test('should to go checkout when click on btn "Ir al resumen"', () => {
    render(
      <Provider store={store}>
        <ShoppingCart />
      </Provider>
    )

    const btnCheckout = screen.getByText('Ir al resumen')
    fireEvent.click(btnCheckout)
    expect(useRouter().push).toHaveBeenCalledWith('/checkout')
  })
})
