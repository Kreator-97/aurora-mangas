import { uiSlice, openSidebar, openShoppingCart, closeShoppingCart, closeSidebar } from '../../../app/slices/uiSlice'

const initialState = {
  isSidebarOpen: false,
  isShoppingCartOpen: false,
}

describe('tests on uiSlice', () => {
  test('name slice should to be ui', () => {
    expect(uiSlice.name).toBe('ui')
  })

  test('initialState should be correct', () => {
    expect(uiSlice.getInitialState()).toEqual(initialState)
  })

  test('should to set isSidebarOpen to true when openSidebar is called', () => {
    const state = uiSlice.reducer(initialState, openSidebar() )
    expect( state ).toEqual({
      isShoppingCartOpen: false,
      isSidebarOpen: true
    })
  })

  test('should to set isShoppingCartOpen to true when openShoppingCart is called', () => {
    const state = uiSlice.reducer(initialState, openShoppingCart() )
    expect( state ).toEqual({
      isShoppingCartOpen: true,
      isSidebarOpen: false
    })
  })

  test('should to toggle isSidebarOpen correctly', () => {
    const state = uiSlice.reducer(initialState, openSidebar() )
    const newState = uiSlice.reducer(state, closeSidebar())
    expect( newState ).toEqual({
      isShoppingCartOpen: false,
      isSidebarOpen: false
    })
  })
  
  test('should to toggle isShoppingCartOpen correctly', () => {
    const state = uiSlice.reducer(initialState, openShoppingCart() )
    const newState = uiSlice.reducer(state, closeShoppingCart())
    expect( newState ).toEqual({
      isShoppingCartOpen: false,
      isSidebarOpen: false
    })
  })
})
