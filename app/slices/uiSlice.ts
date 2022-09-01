import { createSlice } from '@reduxjs/toolkit'

interface State {
  isSidebarOpen: boolean;
  isShoppingCartOpen: boolean;
}

const initialState: State = {
  isSidebarOpen: false,
  isShoppingCartOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isSidebarOpen = true
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false
    },
    closeShoppingCart: (state) => {
      state.isShoppingCartOpen = false
    },
    openShoppingCart: (state) => {
      state.isShoppingCartOpen = true
    }
  }
})

export const { closeSidebar, openSidebar, closeShoppingCart, openShoppingCart } = uiSlice.actions

export default uiSlice.reducer
