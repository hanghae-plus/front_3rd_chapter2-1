// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  val?: number; // 추가 할인 시 사용
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Discounts {
  [key: string]: number;
}

export interface AppState {
  lastSelected: string | null;
  bonusPoints: number;
  totalAmount: number;
  itemCount: number;
  discountRate: number;
}
