import { fireEvent, render, screen } from '@testing-library/react'
import { default as LoginPage } from '../../../../pages/auth/login/index'

import { signIn } from 'next-auth/react'

jest.mock('next-auth/react')

describe('tests on LoginPage', () => {
  test('should to match with snapshot', () => {
    const { container } = render(<LoginPage />)
    expect(container).toMatchSnapshot()
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument
    expect(screen.getByText('Ingresa tu correo electrónico:')).toBeInTheDocument
    expect(screen.getByText('Ingresa tu contraseña:')).toBeInTheDocument
  })

  test('should to call signIn()', () => {
    (signIn as jest.Mock).mockReturnValue(jest.fn())

    render(<LoginPage />)
    const email = 'correo@correo.com', password = '12345678'
    const form = screen.getByTestId('form-login')
    const emailInput = screen.getByRole('textbox', {name: ''})
    const passwordInput = screen.getByTestId('password')
    
    fireEvent.change(emailInput, {target: { name: 'email', value: email}})
    fireEvent.change(passwordInput, {target: { name: 'password', value: password }})
    fireEvent.submit(form)
    
    expect(signIn).toHaveBeenCalledWith('credentials', {email, password})
  })

  test('should to call signIn with google', () => {
    (signIn as jest.Mock).mockReturnValue(jest.fn())

    render(<LoginPage />)

    const googleIcon = screen.getByTestId('google-icon')

    fireEvent.click(googleIcon)

    expect(signIn).toHaveBeenCalledWith('google')
  })
})
