// src/utils/cartUtils.ts
import { CartItem, Discounts } from '../types';

export const calculateTotalAmount = (cartItems: CartItem[], discounts: Discounts) => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    let discount = item.quantity >= 10 ? discounts[item.id] || 0 : 0;
    totalAmount += itemTotal * (1 - discount);
    itemCount += item.quantity;
    subTotal += itemTotal;
  });
  console.log(subTotal)
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = subTotal > 0 ? (subTotal - totalAmount) / subTotal : 0;
  }

  return { totalAmount, itemCount, discountRate };
};
