import { PRODUCT_BULK_DISCOUNT_AMOUNT, PRODUCT_BULK_DISCOUNT_RATE } from '../const/discount';

export const calculateDiscountRate = (totalPrice, discountedTotalPrice) =>
  (totalPrice - discountedTotalPrice) / totalPrice;
export const calculateDiscountedPrice = (price, discountRate) => price * (1 - discountRate);

export const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};
