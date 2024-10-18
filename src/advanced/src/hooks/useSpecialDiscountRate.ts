export const DISCOUNT_DAY = 2;
export const ADDITIONAL_DISCOUNT = 0.1;

/**
 * @function useSpecialDiscountRate
 * @description 특정 요일에 추가 할인을 적용하여 최종 가격과 할인율을 조정하는 훅
 * @param {number} totalPrice - 할인 전 총 구매액
 * @param {number} discountRate - 기존 적용된 할인율
 * @returns {object} 수정된 총 구매액과 할인율을 포함하는 객체 반환
 */

export const useSpecialDiscountRate = (totalPrice, discountRate) => {
  const dayIndex = new Date().getDay();
  if (dayIndex === DISCOUNT_DAY) {
    totalPrice *= 1 - ADDITIONAL_DISCOUNT;
    discountRate = Math.max(discountRate, ADDITIONAL_DISCOUNT);
  }
  return { updatedTotalPrice: totalPrice, updatedDiscountRate: discountRate };
};
