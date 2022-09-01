import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../../app/store'

import { CREATE_AUTHOR } from '../../../../graphql/client/mutations'
import { default as AdminCreateAuthor } from '../../../../pages/admin/authors/create'

// mocks
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

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

describe('tests on AdminCreateAuthor page', () => {
  (useSession as jest.Mock).mockReturnValue({
    status: 'unauthenticated',
    data: null,
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <AdminCreateAuthor />
        </Provider>
      </MockedProvider>
    )

    expect(container).toMatchSnapshot()
    expect(screen.getByLabelText('Nombre del autor')).toBeInTheDocument
  })

  test('should to show error when no passing a valid author name', () => {
    render(
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <AdminCreateAuthor />
        </Provider>
      </MockedProvider>
    )
    
    const form = screen.getByTestId('form-create-serie')
    fireEvent.submit(form)
    
    expect(toast.error).toHaveBeenCalledWith('El campo autor es obligatorio')
  })

  test('should to create a author', async () => {
    const name = 'Tite Kubo'
    const mocks = [
      {
        request: {
          query: CREATE_AUTHOR,
          variables: {
            name,
          }
        },
        result: {
          data: {
            createAuthor: { name, id: '001' }
          }
        }
      }
    ]

    render(
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <AdminCreateAuthor />
        </Provider>
      </MockedProvider>
    )

    const inputAuthor = screen.getByRole('textbox', {name: 'Nombre del autor'})

    fireEvent.change( inputAuthor, {target: { value: name, name: 'author' }} )

    const form = screen.getByTestId('form-create-serie')
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Se ha creado el autor ' + name)
    })
  })
})
