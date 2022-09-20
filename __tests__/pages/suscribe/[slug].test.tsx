import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { default as SuscribeSeriePage } from '../../../pages/suscribe/[slug]'
import { mangas, series } from '../../fixtures/db'

import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'
import { MockedProvider } from '@apollo/client/testing'

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
      <MockedProvider>
        <Provider store={store}>
          <SuscribeSeriePage serie={series[0]} />
        </Provider>
      </MockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('should to show "Suscribete por" message', () => {
    const manga = mangas[0]
    const serie = series[0]
    serie.volumes.push(manga)
    render(
      <MockedProvider>
        <Provider store={store}>
          <SuscribeSeriePage serie={serie} />
        </Provider>
      </MockedProvider>
    )

    expect( screen.getByText(/Suscribete por/) )
  })
})

