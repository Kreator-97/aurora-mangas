import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShoppingCart, ShoppingItem } from '../../interfaces'

const initialState: ShoppingCart = {
  items: [],
  total: 0
}

export const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      const { product, amount } = action.payload

      const item = state.items.find( item => item.product.id === product.id )

      if( !item ) {
        // if item is not included in previous items, we push it
        state.items.push({ product, amount })
        state.total = state.total + (product.price * amount )
        return
      }
      
      item.amount++
      state.total = state.total + (product.price * amount )
    },
    removeItem: (state, action: PayloadAction<{ id: string}>) => {
      const { id } = action.payload
      const items = state.items.filter( item => item.product.id !== id )
      
      state.items = items
      state.total = items.reduce( (acc, item) => (item.product.price * item.amount) + acc, 0)
    },
    setAmount: (state, action: PayloadAction<{amount:number, id: string}>) => {
      const { id, amount } = action.payload
      const index = state.items.findIndex( item => item.product.id === id )
      console.log(action.payload)
      if( index !== -1 ) {
        state.items[index].amount = amount
        state.total = state.items.reduce( (acc, item) => (item.product.price * item.amount) + acc, 0)
      }
    },
    setShoppingCart: (state, action: PayloadAction<ShoppingCart>) => {
      state = action.payload
      return state
    }
  }
})

export const { addItem, removeItem, setAmount, setShoppingCart } = shoppingCartSlice.actions
export default shoppingCartSlice.reducer
