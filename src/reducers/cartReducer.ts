import { CartState, cartAction } from '../types'
import { handleAddToCart, handleChangeQuantity, handleRemoveFromCart, handleUpdateProduct } from './cartActions'
import { handleUpdateTotal } from '../utils'

export function cartReducer(state: CartState, action: cartAction): CartState {
  switch (action.type) {
    case 'SELECT_CART': // 셀렉트 박스에서 선택한 상품의 ID를 저장.
      return { ...state, selectedCartId: action.payload }

    case 'ADD_TO_CART': // 장바구니에 상품을 추가.
      return handleAddToCart(state)

    case 'REMOVE_FROM_CART': // 장바구니에서 상품을 제거.
      return handleRemoveFromCart(state, action.payload)

    case 'CHANGE_QUANTITY': // 상품의 수량을 변경.
      return handleChangeQuantity(state, action.payload)

    case 'CALCULATE_TOTAL': // 장바구니에 담긴 상품의 총 가격을 계산.
      return handleUpdateTotal(state)

    case 'SET_FLASH_SALE': // 플래시 세일 여부를 저장.
      return { ...state, isFlashSale: action.payload }

    case 'SET_RECOMMENDED_SALE': // 추천 세일 여부를 저장.
      return { ...state, isRecommendedSale: action.payload }

    case 'UPDATE_PRODUCT_PRICE': // 상품의 가격을 업데이트.
      return handleUpdateProduct(state, action.payload)

    default:
      return state
  }
}
