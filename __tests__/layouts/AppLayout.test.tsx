import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AppLayout } from '../../layouts/AppLayout'
import { useSession } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../app/store'

jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter: () => ({query: {q: ''}})
  }
})

describe('tests on AppLayout component', () => {
  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <AppLayout title='testing'>
          <></>
        </AppLayout>
      </Provider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should to render children prop', () => {
    render(
      <Provider store={store}>
        <AppLayout title='testing'>
          <section data-testid="content">
            <h2>Content</h2>
          </section>
        </AppLayout>
      </Provider>
    )

    expect(screen.getByTestId('content'))
  })
})
