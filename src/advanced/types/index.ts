export interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

export interface CartItem extends Product {
  quantity: number
}

export type ProductState = {
  selectedProductId: string
  products: Product[]
  totalAmount: number
  points: number
  cart: CartItem[]
  isFlashSale: boolean
  isRecommendedSale: boolean
  discountRate: number
}

export type productAction =
  | { type: 'SELECT_CART'; payload: string }
  | { type: 'ADD_TO_CART' }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CHANGE_QUANTITY'; payload: { id: string; change: number } }
  | { type: 'CALCULATE_TOTAL' }
  | { type: 'SET_FLASH_SALE'; payload: boolean }
  | { type: 'SET_RECOMMENDED_SALE'; payload: boolean }
  | { type: 'UPDATE_PRODUCT_PRICE'; payload: { id: string; discount: number } }
