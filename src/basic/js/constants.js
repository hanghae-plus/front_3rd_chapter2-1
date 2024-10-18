const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

const DISCOUNT_PRODUCT_COUNT = 10;

const DISCOUNT_5_PERCENT = 0.05;
const DISCOUNT_10_PERCENT = 0.1;
const DISCOUNT_15_PERCENT = 0.15;
const DISCOUNT_20_PERCENT = 0.2;
const DISCOUNT_25_PERCENT = 0.25;
const DISCOUNT_RATES = {
  p1: DISCOUNT_10_PERCENT,
  p2: DISCOUNT_15_PERCENT,
  p3: DISCOUNT_20_PERCENT,
  p4: DISCOUNT_5_PERCENT,
  p5: DISCOUNT_25_PERCENT,
};

const DISCOUNT_25_PERCENT_PRODUCT_COUNT = 30;
const ALERT_SHORT_STOCK = '재고가 부족합니다.';

export {
  PRODUCT_LIST,
  DISCOUNT_PRODUCT_COUNT,
  DISCOUNT_5_PERCENT,
  DISCOUNT_10_PERCENT,
  DISCOUNT_15_PERCENT,
  DISCOUNT_20_PERCENT,
  DISCOUNT_25_PERCENT,
  DISCOUNT_RATES,
  DISCOUNT_25_PERCENT_PRODUCT_COUNT,
  ALERT_SHORT_STOCK,
};
