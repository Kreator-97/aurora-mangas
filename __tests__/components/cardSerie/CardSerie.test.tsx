import { fireEvent, render, screen } from '@testing-library/react'

import { CardSerie } from '../../../components/cardSerie'
import { series } from '../../fixtures/db'

// mocks
import { useRouter } from 'next/router'
const push = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    push,
  }),
}))


describe('tests on CardSerie component', () => {
  test('should to match with snapshot', () => {

    const component = render( <CardSerie serie={series[0]} />)
    const cardSerie = screen.getByTestId('card-serie')
    expect(cardSerie).toBeInTheDocument
    expect(component.container).toMatchSnapshot()
    expect( screen.getByText(`Serie: ${series[0].name}`)).toBeInTheDocument
    expect( screen.getByText(`Periodicidad: ${series[0].periodicy}`)).toBeInTheDocument
  })

  test('should to show "Suscribirse" if serie is new realease', () => {
    const serie = series.find(serie => serie.isNewRelease === true)
    render(<CardSerie serie={serie!} />)

    expect(screen.getByText('Suscribirse')).toBeInTheDocument
  })

  test('should to show "Ver serie" if serie is not a new realease', () => {
    const serie = series.find(serie => serie.isNewRelease === false)
    render(<CardSerie serie={serie!} />)

    expect(screen.getByText('Ver serie')).toBeInTheDocument
  })

  test('should to go to the suscribe page when click btn', () => {
    const serie = series.find(serie => serie.isNewRelease === true)
    render(<CardSerie serie={serie!} />)

    const button = screen.getByText('Suscribirse')

    fireEvent.click(button)
    expect(push).toHaveBeenCalledWith(`/suscribe/${serie?.slug}`)
  })

  test('should to go to the serie page when click btn', () => {
    const serie = series.find(serie => serie.isNewRelease === false)
    render(<CardSerie serie={serie!} />)

    const button = screen.getByText('Ver serie')

    fireEvent.click(button)
    expect(push).toHaveBeenCalledWith(`/serie/${serie?.slug}`)
  })

})
