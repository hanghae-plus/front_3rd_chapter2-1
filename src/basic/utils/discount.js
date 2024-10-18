export const calculateDiscountRate = (totalPrice, discountedTotalPrice) =>
  (totalPrice - discountedTotalPrice) / totalPrice;
export const calculateDiscountedPrice = (price, discountRate) => price * (1 - discountRate);
