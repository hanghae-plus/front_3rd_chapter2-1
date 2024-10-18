export const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

/**
 * @function useItemDiscount
 * @description 주어진 상품과 수량에 따라 할인율을 적용하는 훅
 *
 * @param {object} curItem - 현재 선택된 상품 객체
 * @param {number} quantity - 선택된 상품의 수량
 * @returns {number} 적용된 할인율을 반환
 */

export const useItemDiscount = (curItem, quantity) => {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
};
