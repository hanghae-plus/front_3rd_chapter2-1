import { ProductType } from "./components";

export const TWICE = 2;
export const TEN = 10;
export const SECOND_BY_MILLISECOND = 1000;
export const SECOND_TO_MINUTE = 60;

export const LUCKY_SALE_RANGE_TERM = SECOND_BY_MILLISECOND * SECOND_TO_MINUTE;
export const LUCKY_SALE_END_TERM = SECOND_BY_MILLISECOND * TEN * Math.random();
export const SUGGEST_RANGE_TERM = (SECOND_BY_MILLISECOND * SECOND_TO_MINUTE) / TWICE;
export const SUGGEST_END_TERM = SECOND_BY_MILLISECOND * TWICE * TEN * Math.random();

export const LUCKY_SALE_SUCCESS_RATE = 0.3;
export const LUCKY_SALE_DISCOUNT_RATE = 0.8;
export const SUGGEST_DISCOUNT_RATE = 0.95;
export const DISCOUNT_START_QUANTITY = 10;

export const PRODUCT_DISCOUNT_RATE = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 } as const;

export const BULK_DISCOUNT_START_QUANTITY = 30;
export const BULK_DISCOUNT_RATE = 0.25;

export const DATE_TO_TUESDAY = 2;
export const TUESDAY_DISCOUNT_RATE = 0.1;
export const RATE_TO_PERCENT = 100;

export const POINT_PER_AMOUNT = 1000;
export const STOCK_QUANTITY_TO_INFO = 5;

export const PRODUCT_LIST: ProductType[] = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
] as const;
