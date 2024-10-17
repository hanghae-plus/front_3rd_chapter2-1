import { getDiscountedPrice } from '@advanced/utils/getDiscountedPrice';
import {
  MINIMUM_BULK_DISCOUNT_QTY,
  BULK_DISCOUNT_RATE,
} from '@basic/constants/discount';

export const useBulk = () => {
  // 대량 구매 할인 조건
  const validBulk = (discountRate: number, itemQty: number) => {
    const validQty = itemQty >= MINIMUM_BULK_DISCOUNT_QTY;
    const validRate = discountRate < BULK_DISCOUNT_RATE;

    return validQty && validRate;
  };

  // 대량 구매 할인 적용
  const applyBulk = (totalPrice: number) => {
    const price = getDiscountedPrice(totalPrice, BULK_DISCOUNT_RATE);
    return [price, BULK_DISCOUNT_RATE];
  };

  return { validBulk, applyBulk };
};
