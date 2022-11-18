import { expect } from '@jest/globals'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { default as RegisterPage } from '../../../../pages/auth/register'

import { signIn } from 'next-auth/react'
import { CREATE_USER } from '../../../../graphql/client/mutations'
jest.mock('next-auth/react')

import { toast }from 'react-hot-toast'

jest.mock('next/router', () => {
  return {
    ...jest.requireActual('next/router'),
    useRouter: () => ({push: () => {}})
  }
})

jest.mock('react-hot-toast', () => ({
  ...jest.requireActual('react-hot-toast'),
  toast: ({
    success: jest.fn(),
    error: jest.fn(),
  })
}))

describe('tests on RegisterPage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => {
        return {
          matches: true,
          addListener: jest.fn(),
          removeListener: jest.fn()
        }
      })
    })
  })

  test('should to match with snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RegisterPage />
      </MockedProvider>
    )

    expect(container).toMatchSnapshot()
    expect(screen.getByRole('heading',{name: 'Crear cuenta'}))
  })

  test('should to call signIn() on submit', async () => {
    (signIn as jest.Mock).mockReturnValue(jest.fn)

    const name = 'Donato', email = 'donato@correo.com', password = '12345678'

    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: {
            user: { email, password, fullname: name },
          },
        },
        result: {
          data: {
            createUser: {
              user: {
                fullname: name, email, password, id: '123'
              },
              ok: true,
              error: null,
              message: 'Usuario creado'
            }
          }
        }
      }
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterPage />
      </MockedProvider>
    )

    const form = screen.getByTestId('form-register')
    const inputName = screen.getByTestId('input-name')
    const inputEmail = screen.getByTestId('input-email')
    const inputPassword = screen.getByTestId('input-password')

    fireEvent.change(inputName, { target: { value: name, name: 'name' } })
    fireEvent.change(inputEmail, { target: { value: email , name: 'email' } })
    fireEvent.change(inputPassword, {target: { value: password , name: 'password' } })

    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email, password, redirect: false
      })
      expect(toast.success).toHaveBeenCalledWith('Cuenta creada existosamente')
    })
  })
  test('should to call signIn() with google args', () => {

    render(
      <MockedProvider mocks={[]}>
        <RegisterPage />
      </MockedProvider>
    )

    const googleIcon = screen.getByTestId('google-signin')
    fireEvent.click(googleIcon)

    expect(signIn).toHaveBeenCalledWith('google')
  })
})
