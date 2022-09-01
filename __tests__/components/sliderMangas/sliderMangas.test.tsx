import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { mangas } from '../../fixtures/db'
import { SliderMangas } from '../../../components/sliderMangas/SliderMangas'
import { store } from '../../../app/store'

const scrollMock = jest.fn()
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useRef: () => ({current: Object.defineProperty( HTMLDivElement.prototype, 'scrollBy', {
      configurable: true,
      value: scrollMock
    })})
  }
})

describe('test on SliderMangas component', () => {
  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <SliderMangas mangas={mangas} />
      </Provider>
    )

    expect( container ).toMatchSnapshot()
    expect( screen.getByText(`${mangas.length} Mangas`)).toBeInTheDocument
    expect( screen.getAllByTestId('card-manga').length ).toBe(mangas.length)
  })

  test('should to call onScrollRight and onScrollLeft functions', () => {

    render(
      <Provider store={store}>
        <SliderMangas mangas={mangas} />
      </Provider>
    )

    const scrollRightIcon = screen.getByTestId('scroll-right-icon')
    const scrollLeftIcon = screen.getByTestId('scroll-left-icon')

    fireEvent.click(scrollRightIcon)
    expect(scrollMock).toHaveBeenCalledWith(expect.any(Number), 0)
    
    fireEvent.click(scrollLeftIcon)
    expect(scrollMock).toHaveBeenCalledWith(expect.any(Number), 0)
    expect(scrollMock).toHaveBeenCalledTimes(2)
  })
})
