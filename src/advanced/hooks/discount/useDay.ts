import { getDiscountedPrice } from '@advanced/utils/getDiscountedPrice';
import { DAY_DISCOUNT_RATE } from '@basic/constants/discount';

export const useDay = () => {
  // 요일 할인 조건
  const validDay = () => {
    const today = new Date().getDay();
    const validDay = today === 2;

    return validDay;
  };

  // 요일 할인 적용
  const applyDay = (totalPrice: number, discountRate: number) => {
    const rate = Math.max(discountRate, DAY_DISCOUNT_RATE);
    const price = getDiscountedPrice(totalPrice, rate);

    return [price, rate];
  };

  return { validDay, applyDay };
};
