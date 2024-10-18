/**
 * @function getSpecialDiscountRate
 * @description 특정 요일(화요일)에 추가적인 할인을 적용하여 최종 할인율과 가격을 계산하는 로직
 * 화요일에는 총 가격에서 추가로 10% 할인을 적용하고,
 * 계산된 할인율이 기존 할인율보다 클 경우, 더 큰 할인율을 적용
 *
 * @param {number} rate - 현재 적용된 할인율
 * @param {number} totalPrice - 할인이 적용된 후의 총 가격
 * @returns {[number, number]} 새로운 할인율과 조정된 총 가격을 배열로 반환합니다.
 */

const DISCOUNT_DAY = 2;
const ADDITIONAL_DISCOUNT = 0.1;

export const getSpecialDiscountRate = (rate, totalPrice) => {
  const today = new Date().getDay();
  if (today === DISCOUNT_DAY) {
    const discountedPrice = totalPrice * (1 - ADDITIONAL_DISCOUNT);
    rate = Math.max(rate, ADDITIONAL_DISCOUNT);
    totalPrice = discountedPrice;
  }

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalPrice];
};
