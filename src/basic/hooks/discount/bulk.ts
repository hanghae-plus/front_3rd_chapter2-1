import {
  BULK_DISCOUNT_RATE,
  MINIMUM_BULK_DISCOUNT_QTY,
} from '@basic/constants/discount';
import { calcDiscountRate } from './rate';

/**
 * 대량 구매 할인
 * @param {number} discountedPrice 할인된 총액
 * @param {number} originalPrice  할인 적용 안된 총액
 * @param {number} itemQty 장바구니 내부 아이템 총 수량
 * @returns 대량 할인 적용된 총액과 할인율 객체
 */
export const calcBulkDiscount = (originalPrice: number) => {
  const bulkedPrice = originalPrice * (1 - BULK_DISCOUNT_RATE);

  return { bulkPrice: bulkedPrice, bulkRate: BULK_DISCOUNT_RATE };
};

// 대량 구매 조건
export const validBulkDiscount = (
  discountedPrice: number,
  originalPrice: number,
  itemQty: number
) => {
  // 기존 할인율
  const discountedRate = calcDiscountRate(originalPrice, discountedPrice);

  return (
    itemQty >= MINIMUM_BULK_DISCOUNT_QTY && discountedRate < BULK_DISCOUNT_RATE
  );
};
