import { ShoppingCart, ShoppingItem } from '../interfaces'

export const addItemInLocal = (prevCart: ShoppingCart, newItem: ShoppingItem) => {
  const cart: ShoppingCart = {...prevCart, items: [...prevCart.items, newItem], total: (newItem.amount * newItem.product.price) + prevCart.total }
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

const updateItemsInLocal = (cart: ShoppingCart ) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}
