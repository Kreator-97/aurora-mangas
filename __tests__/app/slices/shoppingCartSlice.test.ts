import { expect } from '@jest/globals'
import { shoppingCartSlice, addItem, removeItem, setAmount, setShoppingCart } from '../../../app/slices/shoppingCartSlice'
import { mangas } from '../../fixtures/db'

const initialState = {
  items: [],
  total: 0
}

describe('Tests on shoppingCart slice', () => {
  const product1 = mangas[0]
  const product2 = mangas[1]
  const product3 = mangas[2]

  test('name slice should to be "shoppingCart"', () => {
    expect(shoppingCartSlice.name).toBe('shoppingCart')
  })

  test('should to return the initial state', () => {
    const state = shoppingCartSlice.getInitialState()
    expect(state).toEqual(initialState)
  })

  test('addItem should to add new item to state', () => {
    const product = mangas[0], amount = 1

    const state = shoppingCartSlice.reducer(initialState, addItem({product, amount})) 
    
    expect(state).toEqual({
      items: [{amount, product}],
      total: mangas[0].price
    })
    expect(state.items.length).toBe(1)
  })

  test('items on shoppingCart should to be increased', () => {
    const amount = 1

    const state1 = shoppingCartSlice.reducer(initialState, addItem({product: product1, amount})) 

    const state2 = shoppingCartSlice.reducer(state1, addItem({
      product: product2, amount,
    }))

    const finalState = shoppingCartSlice.reducer(state2, addItem({
      product: product3, amount
    }))

    expect(finalState.items.length).toBe(3)

    const totalExpected = (product1.price * amount) + (product2.price * amount) + (product3.price * amount)
    expect(finalState.total).toBe(totalExpected)
  })

  test('should to increase the amount when product is already on cart', () => {
    // const product 1
    const state1 = shoppingCartSlice.reducer(initialState, addItem({
      product: product1, amount: 1
    }))
    const finalState = shoppingCartSlice.reducer(state1, addItem({
      product: product1, amount: 1
    }))

    expect(finalState.items.length).toBe(1)
    expect(finalState.items[0].amount).toBe(2)

    const totalExpected = finalState.items[0].product.price * finalState.items[0].amount
    expect(finalState.total).toBe(totalExpected)
  })

  test('removeItem() should to remove item', () => {
    const amount = 1

    const state1 = shoppingCartSlice.reducer(initialState, addItem({product: product1, amount}))

    const state2 = shoppingCartSlice.reducer(state1, addItem({product: product2, amount}))

    expect(state2.items.length).toBe(2)

    const finalState = shoppingCartSlice.reducer(state2, removeItem({id: product1.id}))

    expect(finalState.items.length).toBe(1)
    expect(finalState).toEqual({
      items: [{amount, product: product2}],
      total: product2.price * amount
    })
  })

  test('setAmount() should to change the amount of a product', () => {
    const amountExpected = 5
    const state1 = shoppingCartSlice.reducer(initialState, addItem({product: product1, amount:1}))

    const finalState = shoppingCartSlice.reducer(state1, setAmount({
      id: product1.id, amount: amountExpected
    }))

    expect(finalState.items[0].amount).toBe(amountExpected)

    const totalExpected = finalState.items[0].product.price * finalState.items[0].amount

    expect(finalState.total).toBe(totalExpected)
  })

  test('setShoppingCart() should to set shoppingCart', () => {
    const state = shoppingCartSlice.reducer(initialState, setShoppingCart({
      items: [
        {product: product1, amount: 1},
        {product: product2, amount: 2},
        {product: product3, amount: 3},
      ],
      total: (product1.price * 1) + (product2.price * 2) + (product3.price * 3),
    }))

    expect(state.items.length).toBe(3)
    expect(state.total).toBe(state.items.reduce((acc, el) => {
      return acc + (el.product.price * el.amount)
    }, 0))
  })
})
