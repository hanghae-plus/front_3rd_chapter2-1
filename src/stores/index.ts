import { CartState } from '../types'

export const CartStore: CartState = {
  selectedCartId: 'p1',
  products: [
    { id: 'p1', name: '상품1', value: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', value: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', value: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', value: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', value: 25000, quantity: 10 },
  ],
  totalAmount: 0,
  points: 0,
  cart: [],
  isFlashSale: false,
  isRecommendedSale: false,
  discountRate: 0,
}
