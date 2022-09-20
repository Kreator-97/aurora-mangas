import { authSlice, login } from '../../../app/slices/authSlice'
import { users } from '../../fixtures/db'
import { expect } from '@jest/globals'

const initialState = {
  isLogged: false,
  user    : null,
}

describe('tests on authSlice', () => {
  test('should to return a initial state', () => {
    const state = authSlice.getInitialState()
    expect( state ).toEqual(initialState)
  })

  test('login() should to return a auth state', () => {
    const state = authSlice.reducer(initialState, login({user: users[0]}))

    expect(state).toEqual({
      isLogged: true,
      user: users[0]
    })
  })
})
