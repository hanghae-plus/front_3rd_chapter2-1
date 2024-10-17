/**
 * @function applyBulkDiscount
 * @description 대량 구매에 따른 할인 계산
 * 30개 이상의 상품을 구매시 총 할인가격의 25%를 할인
 * 계산된 대량 할인이 일반 항목 할인보다 클 경우 대량 할인을 적용
 *
 * @param {number} totalCount - 카트에 있는 총 상품 수
 * @param {number} totalOriginPrice - 할인 전 총 가격
 * @param {number} totalDiscountPrice - 할인 후 총 가격
 * @returns {[number, number]} 적용된 할인율과 조정된 할인 후 총 가격
 */

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

export const applyBulkDiscount = (totalCount, totalOriginPrice, totalDiscountPrice) => {
  if (totalCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalDiscountPrice * BULK_DISCOUNT_RATE;
    const itemDiscount = totalOriginPrice - totalDiscountPrice;

    if (bulkDiscount > itemDiscount) {
      totalDiscountPrice = totalOriginPrice * (1 - BULK_DISCOUNT_RATE);
      return [BULK_DISCOUNT_RATE, totalDiscountPrice];
    }
  }

  const effectiveDiscountRate = calculateEffectiveRate(totalOriginPrice, totalDiscountPrice);
  return [effectiveDiscountRate, totalDiscountPrice];
};

/**
 * @function calculateEffectiveRate
 * @description 실제 적용된 할인율을 계산
 *
 * @param {number} totalOriginPrice - 할인 전 총 가격
 * @param {number} totalDiscountPrice - 할인 후 총 가격
 * @returns {number} 실제 적용된 할인율
 */

function calculateEffectiveRate(totalOriginPrice, totalDiscountPrice) {
  return (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;
}
