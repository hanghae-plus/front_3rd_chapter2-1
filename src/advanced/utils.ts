import {
  BULK_PURCHASE_THRESHOLD,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
} from './shared/constants.js';

export const isTuesday = () => new Date().getDay() === 2;

export const calculateDiscount = (
  totalWithoutDiscount: number,
  totalWithProductDiscount: number,
  totalQuantity: number,
) => {
  // 기존의 calculateDiscount 함수 내용
};

export const setupIntervalWithDelay = (
  callback: () => void,
  delay: number,
  interval: number,
) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, delay);
};
