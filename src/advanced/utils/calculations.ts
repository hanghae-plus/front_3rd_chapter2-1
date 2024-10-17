import {
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  DISCOUNT_RATES,
  TUESDAY_DISCOUNT_RATE,
} from '../constants';
import { CartItem } from '../types';

export function calculateTotal(cart: CartItem[]): {
  totalAmount: number;
  discountRate: number;
  bonusPoints: number;
} {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  cart.forEach((item) => {
    const quantity = item.quantity;
    const price = item.price;
    let itemTotal = price * quantity;
    subTotal += itemTotal;
    itemCount += quantity;

    if (quantity >= 10) {
      const discountRate = DISCOUNT_RATES[item.id] || 0;
      itemTotal *= 1 - discountRate;
    }
    totalAmount += itemTotal;
  });

  let discountRate = 0;
  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = itemDiscount / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  const bonusPoints = Math.floor(totalAmount / 1000);

  return { totalAmount, discountRate, bonusPoints };
}
