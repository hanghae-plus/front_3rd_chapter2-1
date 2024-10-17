type ProductItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type StockItem = ProductItem;
export type StockList = ProductItem[];

export type TCartItem = ProductItem;
export type TCartList = ProductItem[];

export const DEFAULT_PRODUCT_LIST: StockList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];
