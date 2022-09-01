import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { store } from '../../../../app/store'
import { authors } from '../../../fixtures/db'
import { default as AdminAuthorPage } from '../../../../pages/admin/authors/index'

// mocks
import { useSession } from 'next-auth/react'
jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: () => ({query: {q: ''}})
}))

describe('tests on AdminAuthor page', () => {

  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  test('should to match with snapshot', () => {
    const {container} = render(
      <Provider store={store}>
        <AdminAuthorPage authors={authors} />
      </Provider>
    )

    expect(container).toMatchSnapshot()
    expect(screen.getByText('Autores')).toBeInTheDocument
    expect(screen.getByText('Agregar autor')).toBeInTheDocument
  })

  test('should to show message when there are not authors', () => {
    render(
      <Provider store={store}>
        <AdminAuthorPage authors={[]} />
      </Provider>
    )

    expect(screen.getByText('No existen datos de Autores'))
  })
})
