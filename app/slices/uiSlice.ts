import { createSlice } from '@reduxjs/toolkit'

interface State {
  isSidebarOpen: boolean;
}

const initialState: State = {
  isSidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    open: (state) => {
      state.isSidebarOpen = true
    },
    close: (state) => {
      state.isSidebarOpen = false
    }
  }
})

export const { close, open } = uiSlice.actions

export default uiSlice.reducer
