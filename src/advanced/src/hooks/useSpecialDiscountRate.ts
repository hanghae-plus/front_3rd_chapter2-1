export const DISCOUNT_DAY = 2;
export const ADDITIONAL_DISCOUNT = 0.1;

export const useSpecialDiscountRate = (totalPrice, discountRate) => {
  const dayIndex = new Date().getDay();
  if (dayIndex === DISCOUNT_DAY) {
    totalPrice *= 1 - ADDITIONAL_DISCOUNT;
    discountRate = Math.max(discountRate, ADDITIONAL_DISCOUNT);
  }
  return { updatedTotalPrice: totalPrice, updatedDiscountRate: discountRate };
};
