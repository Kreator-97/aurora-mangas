import { expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { default as AdminCreateManga } from '../../../../pages/admin/mangas/create'
import { series } from '../../../fixtures/db'
import { MockedProvider } from '@apollo/client/testing'
import { Provider } from 'react-redux'
import { store } from '../../../../app/store'

import { useSession } from 'next-auth/react'

jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter: () => ({query: {q: ''}})
  }
})

jest.mock('react-hot-toast', () => {
  return {
    ...jest.requireActual('react-hot-toast'),
    toast: {
      error: jest.fn(),
      success: jest.fn(),
    } 
  }
})

describe('tests on AdminCreateManga page', () => {
  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <AdminCreateManga series={series} />
        </Provider>
      </MockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
