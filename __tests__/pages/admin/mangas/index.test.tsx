import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../../../app/store'
import { mangas } from '../../../fixtures/db'

import { default as AdminMangaPage } from '../../../../pages/admin/mangas/index'

jest.mock('next/router', () => ({
  useRouter: () => ({query: { q: '' }})
}))

jest.mock('next-auth/react')

describe('tests on AdminManga page', () => {

  (useSession as jest.Mock).mockReturnValue({
    useSession: () => ({status: 'unauthenticated', data: null})
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <AdminMangaPage mangas={mangas} />
      </Provider>
    )

    expect(container).toMatchSnapshot()
    expect(screen.getByText('Mangas'))
    expect(screen.getByText('Agregar manga'))
  })

  test('should to show a message when there are not mangas', () => {
    render(
      <Provider store={store}>
        <AdminMangaPage mangas={[]} />
      </Provider>
    )

    expect(screen.getByText('No existen datos de Mangas'))
  })
})
