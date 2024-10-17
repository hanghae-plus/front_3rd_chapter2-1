import { productList } from '../commonData';
import { isTuesday } from './dateUtils';
import { getItemQuantity } from './renderUtils';

const TOTAL_QUANTITY_FOR_DISCOUNT = 30;
const TOTAL_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const QUANTITY_FOR_DISCOUNT = 10;

export function calculateTotalQuantity({ $cartItems }) {
  return [...$cartItems].reduce((acc, cur) => acc + getItemQuantity(cur), 0);
}

export function calculateTotalDiscountRate({
  totalAmountWithoutDiscount,
  totalAmount,
  totalQuantity,
}) {
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
  return { totalDiscountRate, totalAmount };
}

export function calculateTotalAmountWithoutDiscount($cartItems) {
  let totalAmountWithoutDiscount = 0;
  for (let i = 0; i < $cartItems.length; i++) {
    const currentItem = productList.find(
      (product) => product.id === $cartItems[i].id,
    );
    const quantity = getItemQuantity($cartItems[i]);
    const itemAmount = currentItem.price * quantity;
    totalAmountWithoutDiscount += itemAmount;
  }
  return totalAmountWithoutDiscount;
}

export function calculateTotalAmount($cartItems) {
  let totalAmount = 0;
  for (let i = 0; i < $cartItems.length; i++) {
    const currentItem = productList.find(
      (product) => product.id === $cartItems[i].id,
    );
    const quantity = getItemQuantity($cartItems[i]);
    const itemAmount = currentItem.price * quantity;
    const discountRate =
      quantity >= QUANTITY_FOR_DISCOUNT ? currentItem.discountRate : 0;
    totalAmount += itemAmount * (1 - discountRate);
  }
  return totalAmount;
}
