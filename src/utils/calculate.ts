import { ProductState } from '../types'
import {
  DISCOUNT_RATE,
  MIN_FOR_DISCOUNT,
  BULK_LIMIT,
  BULK_DISCOUNT,
  TUESDAY,
  TUESDAY_DISCOUNT,
  FLASH_SALE_DISCOUNT,
  RECOMMENDED_SALE_DISCOUNT,
} from '../constants'

/**
 * @description 포인트 계산
 * @param {number} quantity
 * @param {number} price
 * @returns {number}
 */
export const calculatePoint = (quantity: number, price: number): number => {
  const calculatePointsForIndex = (index: number): number => {
    const basePoints = index * price * 0.001
    return index < 10 ? basePoints : Math.floor(basePoints * 0.9)
  }

  return Array.from({ length: quantity }, (_, index) => index + 1).reduce(
    (totalPoints, currentIndex) => totalPoints + calculatePointsForIndex(currentIndex),
    0,
  )
}

/**
 * @description 상품 할인률 조회
 * @param {string} id
 * @returns {number}
 */
const getProductDiscount = (id: string): number =>
  ({
    p1: 10,
    p2: 15,
    p3: 20,
  })[id] || 0

/**
 * @description 할인률 계산
 * @param {ProductState} state
 * @param {number} totalItems
 * @returns {number}
 */
const getDiscount = (state: ProductState, totalItems: number): number => {
  const today = new Date().getDay()
  const isTuesday = today === TUESDAY

  const tenOverDiscount = totalItems >= MIN_FOR_DISCOUNT ? getProductDiscount(state.selectedProductId) : 0
  const bulkDiscount = totalItems >= BULK_LIMIT ? BULK_DISCOUNT : 0
  const tuesdayDiscount = isTuesday ? TUESDAY_DISCOUNT : 0
  const flashSaleDiscount = state.isFlashSale ? FLASH_SALE_DISCOUNT : 0
  const recommendedSaleDiscount = state.isRecommendedSale ? RECOMMENDED_SALE_DISCOUNT : 0

  return Math.max(tenOverDiscount, bulkDiscount, tuesdayDiscount, flashSaleDiscount, recommendedSaleDiscount)
}

/**
 * @description 총 금액 계산
 * @param {ProductState} state
 * @returns {ProductState}
 */
export function calculateTotalAmount(state: ProductState): ProductState {
  let totalPrice = 0
  let totalItems = 0
  let totalPoints = 0

  state.cart.forEach(({ id, price, quantity }) => {
    const itemTotal = price * quantity
    totalItems += quantity
    totalPoints += calculatePoint(quantity, price)
    totalPrice += itemTotal
  })

  const discountRate = getDiscount(state, totalItems)

  const discountAmount = totalPrice * (discountRate / 100)
  const finalPrice = totalPrice - discountAmount

  return {
    ...state,
    totalAmount: finalPrice,
    points: totalPoints,
    discountRate: discountRate,
  }
}
