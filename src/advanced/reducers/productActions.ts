import { ProductState } from '../types'
import { MESSAGE } from '../constants'

/**
 * @description 새로운 상품을 장바구니에 추가.
 * @param {ProductState} state
 * @returns {ProductState}
 */
export function handleAddToCart(state: ProductState): ProductState {
  const selectedCart = state.products.find(({ id }) => id === state.selectedProductId)
  if (!selectedCart) return state

  if (!selectedCart.quantity) {
    alert(MESSAGE.STOCK_STATUS.INSUFFICIENT)
    return state
  }

  const updatedCart = [...state.cart]
  const currentItemIndex = updatedCart.findIndex((item) => item.id === selectedCart.id)

  if (currentItemIndex !== -1) {
    updatedCart[currentItemIndex] = {
      ...updatedCart[currentItemIndex],
      quantity: updatedCart[currentItemIndex].quantity + 1,
    }
  } else {
    updatedCart.push({ ...selectedCart, quantity: 1 })
  }

  const updatedProducts = state.products.map((item) =>
    item.id === selectedCart.id ? { ...item, quantity: item.quantity - 1 } : item,
  )

  return { ...state, cart: updatedCart, products: updatedProducts }
}

/**
 * @description 장바구니에서 상품을 제거.
 * @param {ProductState} state
 * @param {string} itemId
 * @returns {ProductState}
 */
export function handleRemoveProduct(state: ProductState, itemId: string): ProductState {
  const removedCart = state.cart.find(({ id }) => id === itemId)
  if (!removedCart) return state

  const updatedCart = state.cart.filter((item) => item.id !== itemId)
  const updatedProducts = state.products.map((item) =>
    item.id === itemId ? { ...item, quantity: item.quantity + removedCart.quantity } : item,
  )

  return { ...state, cart: updatedCart, products: updatedProducts }
}

/**
 * @description 상품의 수량을 변경.
 * @param {ProductState} state
 * @param {{ id: string; change: number }} payload
 * @returns {ProductState}
 */
export function handleChangeQuantity(state: ProductState, payload: { id: string; change: number }): ProductState {
  const { id: selectedProductId, change } = payload
  const product = state.products.find(({ id }) => id === selectedProductId)
  const cartItem = state.cart.find(({ id }) => id === selectedProductId)

  if (!product || !cartItem) return state

  const newCartQuantity = Math.max(0, cartItem.quantity + change)
  const availableStock = product.quantity + cartItem.quantity

  if (newCartQuantity > availableStock) {
    alert(MESSAGE.STOCK_STATUS.INSUFFICIENT)
    return state
  }

  // 장바구니에서 상품의 수량을 변경
  const updatedCart = state.cart
    .map((item) => {
      if (item.id === selectedProductId) {
        return { ...item, quantity: newCartQuantity }
      }
      return item
    })
    .filter(({ quantity }) => quantity)

  // 상품의 재고를 변경
  const updatedProducts = state.products.map((item) => {
    if (item.id === selectedProductId) {
      return { ...item, quantity: availableStock - newCartQuantity }
    }
    return item
  })

  return { ...state, cart: updatedCart, products: updatedProducts }
}

/**
 * @description 상품의 가격을 업데이트
 * @param {ProductState} state
 * @param {{ id: string; discount: number }} payload
 * @returns {ProductState}
 */
export function handleUpdateProduct(state: ProductState, payload: { id: string; discount: number }): ProductState {
  const { id: selectedProductId, discount } = payload
  const updatedProducts = state.products.map((product) =>
    product.id === selectedProductId ? { ...product, price: Math.round(product.price * (1 - discount)) } : product,
  )

  const updatedCart = state.cart.map((item) =>
    item.id === selectedProductId ? { ...item, price: Math.round(item.price * (1 - discount)) } : item,
  )

  return { ...state, products: updatedProducts, cart: updatedCart }
}
