export const BULK_DISCOUNT_THRESHOLD = 30;
export const BULK_DISCOUNT_RATE = 0.25;

/**
 * @function useApplyBulkDiscount
 * @description 대량 구매 할인을 적용하여 실제 할인율을 계산
 * 
 * @param {number} subTotal - 할인이 적용되기 전의 총액
 * @param {number} totalPrice - 할인이 적용된 후의 실제 결제 총액
 * @param {number} totalQuantity - 구매하는 상품의 총 수량
 * 
 * @returns {number} 실제 적용된 할인율 반환
 */

export const useApplyBulkDiscount = (subTotal, totalPrice, totalQuantity) => {
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalPrice;
    if (bulkDiscount > itemDiscount) {
      return BULK_DISCOUNT_RATE;
    }
    return itemDiscount / subTotal;
  }
  return (subTotal - totalPrice) / subTotal;
};
