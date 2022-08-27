import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'

import { store } from '../../app/store'
import { default as HomePage} from '../../pages/index'
import { series, mangas, users } from '../fixtures/db'

jest.mock('next-auth/react')

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { myProp: 'myValue' },
  }),
}))

describe('Tests in Homepage', () => {
  test('Home page should to contain key layouts elements', () => {
    const mockSession = {
      data: users[1],
      status: 'authenticated'
    };

    (useSession as jest.Mock).mockReturnValue(mockSession)

    render(
      <Provider store={store}>
        <HomePage series={ series } mangasInfo={{ mangas, page: 1, total: 1, totalPages: 1 }}
        />
      </Provider>
    )
    expect(screen.getByText('Series nuevas')).toBeInTheDocument
    expect(screen.getByText('Últimos lanzamientos')).toBeInTheDocument
    expect(screen.getByText('Síguenos en nuestras redes sociales') ).toBeInTheDocument

    expect(screen.getAllByTestId('card-manga').length ).toBe(mangas.length)
    expect(screen.getAllByTestId('card-suscribe').length )
      .toBe(series.filter(series => series.isNewRelease === true).length )
  })
})
