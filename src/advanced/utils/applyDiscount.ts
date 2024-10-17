/**
 * 할인 적용
 * @param {number} price
 * @param {number} discountRate
 */
export const applyDiscount = (price: number, discountRate: number) => {
  return Math.round(price * (1 - discountRate));
};
