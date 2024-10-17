import { isNaN } from 'lodash-es';

export const calcDiscountRate = (price: number, discounted: number) => {
  const rate = parseFloat(((price - discounted) / price).toFixed(2));
  return isNaN(rate) ? 0 : rate;
};
