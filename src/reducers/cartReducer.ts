import { CartState, cartAction } from '../types'

export function cartReducer(state: CartState, action: cartAction): CartState {
  switch (action.type) {
    case 'SELECT_CART':
      return { ...state, selectedCartId: action.payload }

    case 'ADD_TO_CART': {
      const selectedCart = state.products.find(({ id }) => id === state.selectedCartId)
      if (!selectedCart || selectedCart.quantity === 0) return state

      const updatedCart = [...state.cart]
      const currentItemId = updatedCart.findIndex((item) => item.id === selectedCart.id)

      if (currentItemId !== -1) {
        updatedCart[currentItemId] = {
          ...updatedCart[currentItemId],
          quantity: updatedCart[currentItemId].quantity + 1,
        }
      } else {
        updatedCart.push({ ...selectedCart, quantity: 1 })
      }

      const updatedProducts = state.products.map((item) =>
        item.id === selectedCart.id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      return { ...state, cart: updatedCart, products: updatedProducts }
    }

    case 'REMOVE_FROM_CART': {
      const removedCart = state.cart.find((item) => item.id === action.payload)
      if (!removedCart) return state

      const updatedCart = state.cart.filter((item) => item.id !== action.payload)
      const updatedProducts = state.products.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + removedCart.quantity } : item,
      )

      return { ...state, cart: updatedCart, products: updatedProducts }
    }

    case 'CHANGE_QUANTITY': {
      const { id, change } = action.payload
      const updatedCart = state.cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      const updatedProducts = state.products.map((item) => {
        if (item.id === id) {
          const cartItem = state.cart.find((cItem) => cItem.id === id)
          const oldQuantity = cartItem ? cartItem.quantity : 0
          const newQuantity = updatedCart.find((cItem) => cItem.id === id)?.quantity || 0
          return { ...item, quantity: item.quantity + (oldQuantity - newQuantity) }
        }
        return item
      })

      return { ...state, cart: updatedCart, products: updatedProducts }
    }

    case 'CALCULATE_TOTAL': {
      let totalPrice = 0
      let totalItems = 0
      let totalPoints = 0
      let appliedDiscount = 0

      const today = new Date().getDay()
      const isTuesday = today === 2

      const calculatePoints = (quantity: number): number => {
        let points = 0
        for (let i = 1; i <= quantity; i++) {
          if (i < 10) {
            points += i * 10
          } else {
            // 10개 이상부터는 10% 할인 적용
            points += Math.floor(i * 10 * 0.9)
          }
        }
        return points
      }

      state.cart.forEach(({ id, value, quantity }) => {
        let itemTotal = value * quantity
        totalItems += quantity

        // 정확한 포인트 계산
        totalPoints += calculatePoints(quantity)

        if (quantity >= 10) {
          switch (id) {
            case 'p1':
              itemTotal *= 0.9
              appliedDiscount = Math.max(appliedDiscount, 10)
              break
            case 'p2':
              itemTotal *= 0.85
              appliedDiscount = Math.max(appliedDiscount, 15)
              break
            case 'p3':
              itemTotal *= 0.8
              appliedDiscount = Math.max(appliedDiscount, 20)
              break
          }
        }

        totalPrice += itemTotal
      })

      if (totalItems >= 30) {
        totalPrice *= 0.75
        appliedDiscount = Math.max(appliedDiscount, 25)
      }

      if (isTuesday) {
        totalPrice *= 0.9
        appliedDiscount = Math.max(appliedDiscount, 10)
      }

      if (state.isFlashSale) {
        totalPrice *= 0.8
        appliedDiscount = Math.max(appliedDiscount, 20)
      }

      if (state.isRecommendedSale) {
        totalPrice *= 0.95
        appliedDiscount = Math.max(appliedDiscount, 5)
      }

      return { ...state, totalAmount: totalPrice, points: totalPoints, discountRate: appliedDiscount }
    }

    case 'SET_FLASH_SALE':
      return { ...state, isFlashSale: action.payload }

    case 'SET_RECOMMENDED_SALE':
      return { ...state, isRecommendedSale: action.payload }

    default:
      return state
  }
}
