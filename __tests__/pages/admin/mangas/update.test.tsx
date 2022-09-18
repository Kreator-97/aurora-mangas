import { expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { default as AdminUpdateManga } from '../../../../pages/admin/mangas/update'
import { mangas, series } from '../../../fixtures/db'
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

describe('tests on AdminUpdateManga page', () => {
  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <AdminUpdateManga manga={mangas[0]} series={series} />
        </Provider>
      </MockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
