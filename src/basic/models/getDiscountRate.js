/**
 * @function getDiscountRate
 * @description 주어진 카트 아이템에 대한 할인율 결정
 * 아이템 수량이 특정 수량 이상일 때만 할인이 적용
 *
 * @param {Object} cart - 할인율을 계산할 카트 아이템 객체
 * @returns {number} 계산된 할인율을 반환, 할인이 없을 경우 0을 리턴
 */

const MIN_QUANTITY_FOR_DISCOUNT = 10;

export const discountRates = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

export const getDiscountRate = (cart) => {
  const { id, quantity } = cart;
  if (quantity < MIN_QUANTITY_FOR_DISCOUNT) {
    return 0;
  }

  return discountRates[id] || 0;
};
