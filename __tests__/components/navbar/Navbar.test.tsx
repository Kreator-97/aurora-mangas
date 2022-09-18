import { expect } from '@jest/globals'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { fireEvent, render, screen } from '@testing-library/react'

import { Navbar } from '../../../components/navbar/Navbar'
import { openSidebar, openShoppingCart } from '../../../app/slices/uiSlice'
import { store } from '../../../app/store'

const router = { query: { q: 'hello'}, push: jest.fn() }

jest.mock('next/router', () => ({
  useRouter: () => (router)
}))

jest.mock('../../../app/slices/uiSlice', () => ({
  openSidebar: jest.fn().mockReturnValue({
    payload: undefined, type: 'cart/openSidebar'
  }),
  openShoppingCart: jest.fn().mockReturnValue({
    payload: undefined, type: 'cart/openShoppingCart'
  })
}))

describe('test on Nabvar component', () => {
  test('should to match with snapshot', () => {
    
    const { container } = render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    )
    expect(container).toMatchSnapshot()
  })

  test('openMenu function should to be called', () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    )
    const iconMenu = screen.getByTestId('menu')
    
    fireEvent.click(iconMenu)

    expect(openSidebar).toHaveBeenCalled()
  })

  test('openShoppingCart function should to be called', () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    )
    const cartMenu = screen.getByTestId('cart-menu')
    
    fireEvent.click(cartMenu)

    expect(openShoppingCart).toHaveBeenCalled()
  })

  test('onSearch function should to be called with query string', () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    )
    const searchForm = screen.getByTestId('search-form')
    const inputSearch = screen.getByRole('searchbox')
    
    const value = 'one punch man'
    fireEvent.change(inputSearch, {target: {value, name: 'search'}})

    fireEvent.submit(searchForm)
    expect(useRouter().push).toHaveBeenCalledWith(`/search?q=${value}`)
  })
})

