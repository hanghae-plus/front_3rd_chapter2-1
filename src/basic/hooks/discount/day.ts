import { DAY_DISCOUNT_RATE } from '@basic/constants/discount';

/**
 * 요일에 따른 추가 할인
 * @param {number} discountedPrice // 할인된 총액
 * @param {number} discountRate // 할인율
 * @returns {{dayPrice: number, dayRate:number}} 할인 적용된 총액
 */
export const calcDayDiscount = (
  discountedPrice: number,
  discountRate: number
) => {
  const dayPrice = discountedPrice * (1 - DAY_DISCOUNT_RATE);
  const dayRate = Math.max(discountRate, DAY_DISCOUNT_RATE);
  return { dayPrice, dayRate };
};

// 요일 조건
export const validDayDiscount = () => {
  // 화요일
  const today = new Date().getDay(); // 0: Sunday,2: Tuesday, 5: Friday
  return today === 2;
};
