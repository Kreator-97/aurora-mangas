import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { CardManga } from '../../../components/cardManga/CardManga'
import { mangas } from '../../fixtures/db'
import { store } from '../../../app/store'

// mocks
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { formatPrice } from '../../../util'

jest.mock('../../../app/hooks')
jest.mock('../../../util')
jest.mock('react-hot-toast')

const dispatch = jest.fn()

const manga = mangas[0];

(useAppSelector as jest.Mock).mockReturnValue(() => ({items: [], total: 0}));
(useAppDispatch as jest.Mock).mockReturnValue(dispatch);
(formatPrice as jest.Mock).mockReturnValue('$99.00')


describe('tests on CardManga component', () => {

  test('should to match with snapshot', () => {
    const component = render(
      <Provider store={store}>
        <CardManga manga={ manga } />
      </Provider>
    )

    expect(component.container).toMatchSnapshot()
    expect(screen.getByTestId('card-manga')).toBeInTheDocument
    expect(screen.getByText(`${manga.serie.name} #${manga.number}`))
  })

  test('should to call onAddToCart event', () => {
    render(
      <Provider store={store}>
        <CardManga manga={ manga } />
      </Provider>
    )

    const button = screen.getByText('Agregar al carrito')

    expect(button).toBeInTheDocument
    fireEvent.click( button )
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        amount: expect.any(Number),
        product: manga,
      },
      type: expect.any(String),
    })
  })
})
