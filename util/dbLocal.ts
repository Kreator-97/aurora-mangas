import { ShoppingCart, ShoppingItem } from '../interfaces'

export const addItemInLocal = (prevCart: ShoppingCart, newItem: ShoppingItem) => {
  const productIndex = prevCart.items.findIndex( (item) => item.product.id === newItem.product.id )
  let items: ShoppingItem[] = []

  if( productIndex === -1 ) {
    // product is not included in cart, we add it
    items = [...prevCart.items, newItem]
  } else {
    // product is included in cart, we increment the amount
    items = prevCart.items.map((item => {
      if( item.product.id === newItem.product.id ) {
        return {
          product: item.product,
          amount: item.amount + newItem.amount
        }
      }
      return item
    }))
  }

  const cart: ShoppingCart = {
    ...prevCart,
    items,
    total: (newItem.amount * newItem.product.price) + prevCart.total
  }
  updateItemsInLocal(cart)
}

export const removeItemInLocal = (prevCart: ShoppingCart, id: string) => {
  const cart: ShoppingCart = { ...prevCart, items: prevCart.items.filter( (item) => item.product.id !== id) }
  cart.total = cart.items.reduce((acc, item) => {
    return (item.product.price * item.amount + acc)
  }, 0)
  updateItemsInLocal(cart)
}

export const setProductAmountInLocal = (prevCart: ShoppingCart, amount: number, id: string ) => {
  const cart: ShoppingCart = {...prevCart, items: prevCart.items.map((item) =>( {...item, amount: item.product.id === id ? amount : item.amount })) }
  cart.total = cart.items.reduce((acc, item) => {
    return (item.product.price * item.amount + acc)
  }, 0)

  updateItemsInLocal(cart)
}

export const loadShoppingCart = ():ShoppingCart | null => {
  return JSON.parse(localStorage.getItem('cart') || 'null')
}

export const cleanShoppingCart = () => {
  const cart:ShoppingCart = {
    items: [],
    total: 0
  }

  updateItemsInLocal(cart)
}

const updateItemsInLocal = (cart: ShoppingCart ) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}
