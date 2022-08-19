import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../interfaces'

interface State {
  isLogged: Boolean;
  user    : User | null;
  isLoading: Boolean;
}

const initialState: State = {
  isLogged: false,
  user    : null,
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user } = action.payload
      state.user = user
      state.isLogged = true
    },

  }
})

export const { login } = authSlice.actions
export default authSlice.reducer
