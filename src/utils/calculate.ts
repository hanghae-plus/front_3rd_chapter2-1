import { CartState } from '../types'
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
 * @param {number} value
 * @returns {number}
 */
export const handleUpdatePoint = (quantity: number, value: number): number => {
  const calculatePointsForIndex = (index: number): number => {
    const basePoints = index * value * 0.001
    return index < 10 ? basePoints : Math.floor(basePoints * 0.9)
  }

  return Array.from({ length: quantity }, (_, index) => index + 1).reduce(
    (totalPoints, currentIndex) => totalPoints + calculatePointsForIndex(currentIndex),
    0,
  )
}

/**
 * @description 총 금액 계산
 * @param {CartState} state
 * @returns {CartState}
 */
export function handleUpdateTotal(state: CartState): CartState {
  let totalPrice = 0
  let totalItems = 0
  let totalPoints = 0

  const today = new Date().getDay()
  const isTuesday = today === TUESDAY

  const getDiscount = (...rates: number[]) => Math.max(...rates) * 100

  state.cart.forEach(({ id, value, quantity }) => {
    const itemTotal = value * quantity
    totalItems += quantity
    totalPoints += handleUpdatePoint(quantity, value)

    const discountRate = quantity >= MIN_FOR_DISCOUNT ? DISCOUNT_RATE[id as keyof typeof DISCOUNT_RATE] || 0 : 0
    totalPrice += itemTotal * (1 - discountRate)
  })

  const bulkDiscount = totalItems >= BULK_LIMIT ? BULK_DISCOUNT : 0
  const tuesdayDiscount = isTuesday ? TUESDAY_DISCOUNT : 0
  const flashSaleDiscount = state.isFlashSale ? FLASH_SALE_DISCOUNT : 0
  const recommendedSaleDiscount = state.isRecommendedSale ? RECOMMENDED_SALE_DISCOUNT : 0

  const totalDiscount = getDiscount(bulkDiscount, tuesdayDiscount, flashSaleDiscount, recommendedSaleDiscount)
  totalPrice *= 1 - totalDiscount / 100

  return { ...state, totalAmount: totalPrice, points: totalPoints, discountRate: totalDiscount }
}
