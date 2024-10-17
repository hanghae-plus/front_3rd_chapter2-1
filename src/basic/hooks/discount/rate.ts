import { findProductById } from '../../utils/find';

/**
 * 구매 개수에 따른 할인율 반환
 * @param {string} itemId
 * @param {number} quantity
 * @returns {number} 제품에 따른 할인율
 */
export const getDiscountRate = (itemId: string, quantity: number): number => {
  // 10개 미만이면 할인율 0
  if (quantity < 10) return 0;

  const item = findProductById(itemId);
  // 제품이 존재하지 않으면 0 반환
  if (!item) return 0;

  // 할인율이 존재하면 반환, 없으면 0
  return item.discount ?? 0;
};

/**
 * 할인율 계산 (소수점 반환)
 * @param {number} original 할인 안된 총액
 * @param {number} discounted 할인 적용된 총액
 * @returns 소수점 둘째 자리까지 반올림된 할인율(소수점)
 */
export const calcDiscountRate = (
  original: number,
  discounted: number
): number => {
  if (original === 0) return 0; // NaN 방지

  // 할인율 계산
  const rate = (original - discounted) / original;

  // 문자열로 반환된 결과를 parseFloat로 숫자로 변환
  return parseFloat(rate.toFixed(2));
};
