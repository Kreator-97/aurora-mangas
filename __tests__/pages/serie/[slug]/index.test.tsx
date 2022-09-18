import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'

import { store } from '../../../../app/store'
import { default as SeriePage } from '../../../../pages/serie/[slug]/index'
import { series } from '../../../fixtures/db'

// mocks
jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: () => ({query: { q: '' }})
}))

describe('tests on Serie page', () => {
  (useSession as jest.Mock).mockReturnValue(() => ({
    status: 'unauthenticated',
    data: null
  }))

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <SeriePage serie={series[0]} />
      </Provider>
    )
    expect(container).toMatchSnapshot()
    expect(screen.getByRole('heading', { level: 1 }))
    expect(screen.getByText( series[0].sinopsis! ))
  })
})
