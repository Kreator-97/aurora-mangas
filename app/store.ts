import { configureStore } from '@reduxjs/toolkit'
import { uiSlice, authSlice, shoppingCartSlice } from './slices'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    cart: shoppingCartSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
