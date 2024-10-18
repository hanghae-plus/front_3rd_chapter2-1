export const PRODUCT_DATA = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export const DISCOUNT_RULES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
  supriseSale: 0.2,
  salesProduct: 0.05,
  bulk: 0.25,
};

export const DISCOUTNT_RULES_OF_TUESDAY = { discountRate: 0.1, dayNumber: 2 };

export const MESSAGE = {
  SUPRISE_SALE: (name: string) => '번개세일! ' + name + '이(가) 20% 할인 중입니다!',
  ADDITIONAL_SALE: (name: string) => name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  NOT_ENOUGH_PRODUCT: '재고가 부족합니다.',
};

export const DURATION = {
  1000: 1000,
  2000: 2000,
  3000: 3000,
  6000: 6000,
};

export const QUANTITY = {
  5: 5,
  10: 10,
  30: 30,
};
