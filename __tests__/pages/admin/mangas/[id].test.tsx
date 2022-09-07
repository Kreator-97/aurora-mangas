import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { default as MangaDetailsPage } from '../../../../pages/admin/mangas/[id]'
import { mangas } from '../../../fixtures/db'
import { store } from '../../../../app/store'

// mocks
import { useSession } from 'next-auth/react'
jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter: () => ({query: {q: ''}})
  }
})

describe('tests on MangaDetails page', () => {
  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  const manga = mangas[0]

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MangaDetailsPage manga={ {...manga, soldUnits: 10} } />
      </Provider>
    )

    expect(container).toMatchSnapshot()
    screen.getByText('Titulo')
    screen.getByText('Serie')
    screen.getByText('Número')
    screen.getByText('Publicado')
    screen.getByText('Precio')
    screen.getByText('Stock')
    screen.getByText('Unidades vendidas')
  })
})
