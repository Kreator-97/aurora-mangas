import { render, screen } from '@testing-library/react'
import { default as SuscribeSeriePage } from '../../../pages/suscribe/[slug]'
import { mangas, series } from '../../fixtures/db'

import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: () => ({query: { q: '' }})
}))

describe('tests on SuscribeSerie page', () => {
  (useSession as jest.Mock).mockReturnValue(() => ({
    status: 'unauthenticated',
    data: null,
  }))

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <SuscribeSeriePage serie={series[0]} />
      </Provider>
    )
    expect(container).toMatchSnapshot()
  })

  test('should to show "Suscribete proximamente" button if there are not volumes published on series', () => {
    render(
      <Provider store={store}>
        <SuscribeSeriePage serie={series[0]} />
      </Provider>
    )

    expect( screen.getByText('Suscribete proximamente') ).toBeInTheDocument
  })

  test('should to show "Suscribete por" button if there are prices on volumes', () => {
    const manga = mangas[0]
    const serie = series[0]
    serie.volumes.push(manga)
    render(
      <Provider store={store}>
        <SuscribeSeriePage serie={serie} />
      </Provider>
    )

    expect( screen.getByText(/Suscribete por/) ).toBeInTheDocument
  })
})

