import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../interfaces'

interface State {
  isLogged: Boolean;
  user    : User | null;
}

const initialState: State = {
  isLogged: false,
  user    : null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action:PayloadAction<{user: User}>) => {
      const { user } = action.payload
      return {...state, user, isLogged: true}
    },
  }
})

export const { login } = authSlice.actions
export default authSlice.reducer
