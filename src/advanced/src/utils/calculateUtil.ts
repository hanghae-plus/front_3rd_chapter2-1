import {
  TOTAL_DISCOUNT_RATE,
  TOTAL_QUANTITY_FOR_DISCOUNT,
  TUESDAY_DISCOUNT_RATE,
} from '../constants';
import { isTuesday } from './dateUtil';

export function calculateTotalDiscountRate(
  totalAmountWithoutDiscount: number,
  totalAmount: number,
  totalQuantity: number,
): number {
  let totalDiscountRate = 0;
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity >= TOTAL_QUANTITY_FOR_DISCOUNT) {
    const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
    if (bulkDiscount > itemDiscount) {
      totalAmount = totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
      totalDiscountRate = TOTAL_DISCOUNT_RATE;
    } else {
      totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
    }
  } else {
    totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
  }
  if (isTuesday()) {
    totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
  }
  return totalDiscountRate;
}

export function calculateTotalAmount(
  totalAmountWithoutDiscount: number,
  totalAmount: number,
  totalQuantity: number,
): number {
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity < TOTAL_QUANTITY_FOR_DISCOUNT) return totalAmount;
  const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
  if (bulkDiscount <= itemDiscount) return totalAmount;
  return totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
}
