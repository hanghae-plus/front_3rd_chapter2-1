import { PRODUCT_BULK_DISCOUNT_AMOUNT, PRODUCT_BULK_DISCOUNT_RATE } from '../constants';

export const calculateDiscountRate = (totalPrice: number, discountedTotalPrice: number) =>
  (totalPrice - discountedTotalPrice) / totalPrice;
export const calculateDiscountedPrice = (price: number, discountRate: number) => price * (1 - discountRate);

export const discountRateToPercent = (discountRate: number) => (discountRate * 100).toFixed(1);

export const getProductBulkDiscountRate = (productId: string, quantity: number) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};
