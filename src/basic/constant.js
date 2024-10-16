const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', val: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', val: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', val: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', val: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', val: 25000, quantity: 10 },
];

const TUESDAY = 2;
const BULK_DISCOUNT_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const RANDOM_RATE_LIMIT = 0.3;
const LUCKY_DISCOUNT_RATE = 0.2;
const EXTRA_DISCOUNT_RATE = 0.05;
const DISCOUNT_RATE_BY_ID = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

export {
  PRODUCT_LIST,
  TUESDAY,
  BULK_DISCOUNT_AMOUNT,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
  RANDOM_RATE_LIMIT,
  LUCKY_DISCOUNT_RATE,
  EXTRA_DISCOUNT_RATE,
  DISCOUNT_RATE_BY_ID,
};
