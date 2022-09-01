import { fireEvent, render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'

import { store } from '../../../../app/store'
import { mangas } from '../../../fixtures/db'
import { addItem } from '../../../../app/slices/shoppingCartSlice'
import { default as MangaPage  } from '../../../../pages/serie/[slug]/[number]'

// mocks
jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: () => ({query: { q: '' }})
}))
jest.mock('../../../../app/hooks/index', () => ({
  useAppSelector: (state:any) => ({cart: {items: []}}).cart,
  useAppDispatch: () => jest.fn(),
}))
jest.mock('../../../../components/sidebar')
jest.mock('../../../../components/shoppingCart')
jest.mock('../../../../app/slices/shoppingCartSlice', () => ({
  addItem: jest.fn()
}))
jest.mock('../../../../util')

describe('tests on Manga Page', () => {
  const manga = mangas[0];

  (useSession as jest.Mock).mockReturnValue(() => ({
    status: 'unauthenticated',
    data: null
  }))

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MangaPage manga={manga} />
      </Provider>
    )

    const headingTitle = screen.getByRole('heading', {level: 1})
    expect(container).toMatchSnapshot()
    expect( headingTitle.textContent).toBe(`${manga.serie.name} #${manga.number}`)
  })

  test('should to dispatch addItem action ', () => {
    render(
      <Provider store={store}>
        <MangaPage manga={manga} />
      </Provider>
    )

    const addButton = screen.getByText('Agregar al carrito')
    fireEvent.click(addButton)

    expect(addItem).toHaveBeenCalledWith({
      amount: expect.any(Number),
      product: manga
    })
  })
})
