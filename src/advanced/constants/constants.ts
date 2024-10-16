// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// 상품 목록
const PRODUCT_LIST: Product[] = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

// 할인률 상수
const DISCOUNT_PRODUCT_COUNT = 10;

const DISCOUNT_5_PERCENT = 0.05;
const DISCOUNT_10_PERCENT = 0.1;
const DISCOUNT_15_PERCENT = 0.15;
const DISCOUNT_20_PERCENT = 0.2;
const DISCOUNT_25_PERCENT = 0.25;

// id별 할인률
const DISCOUNT_RATES: Record<string, number> = {
  p1: DISCOUNT_10_PERCENT,
  p2: DISCOUNT_15_PERCENT,
  p3: DISCOUNT_20_PERCENT,
  p4: DISCOUNT_5_PERCENT,
  p5: DISCOUNT_25_PERCENT,
};

// 할인률 기준 상품 수
const DISCOUNT_25_PERCENT_PRODUCT_COUNT = 30;

//재고 부족 alert
const ALERT_SHORT_STOCK: string = '재고가 부족합니다.';

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
