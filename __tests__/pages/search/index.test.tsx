import { render, screen } from '@testing-library/react'
import { default as SearchPage } from '../../../pages/search/index'
import { mangas } from '../../fixtures/db'

import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../../app/store'

// mocks
jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter: () => ({query: {q: '' }})
  }
})

describe('tests on Search page', () => {
  (useSession as jest.Mock).mockReturnValue(() => ({
    status: 'unauthenticated',
    data: null
  }))

  test('should to match with snapshot', () => {

    const result = {
      series: [],
      mangas: mangas,
      total: mangas.length
    }

    const query = 'One punch man'

    const { container } = render(
      <Provider store={store}> 
        <SearchPage query={query} results={result} />
      </Provider>
    )

    expect( container ).toMatchSnapshot()
    expect( screen.getByText(`Resultados para "${query}"`)).toBeInTheDocument
  })
})

