import { Product } from '../types';

// 초기 상태 인터페이스
interface AccumulatedState {
  totalAmt: number;
  itemCnt: number;
  subTot: number;
}

const initialAccState: AccumulatedState = { totalAmt: 0, itemCnt: 0, subTot: 0 };

// 수량 조절 함수
export const updateQty = (cart: Product[], id: string, value: number) => {
  return cart.map((prod) => (prod.id === id ? { ...prod, qty: prod.qty + value } : prod));
};

// 상품별 총액, 수량, 할인 전 총합 계산 함수
export const calculateCartTotals = (
  cart: Product[],
  products: Product[],
): { totalAmt: number; itemCnt: number; subTot: number } => {
  return cart.reduce<AccumulatedState>((acc, { val, qty, id }): AccumulatedState => {
    const product = products.find((prod) => prod.id === id);
    const discount = qty >= 10 ? (product?.disc ?? 0) : 0;
    const itemTotal = calculateItemTotal(val, qty, discount);

    return {
      totalAmt: acc.totalAmt + itemTotal,
      itemCnt: acc.itemCnt + qty,
      subTot: acc.subTot + val * qty, // 할인 전 가격
    };
  }, initialAccState);
};

// 할인율 계산 함수
export const calculateDiscount = (subTot: number, totalAmt: number): number => {
  const itemDiscount = (subTot - totalAmt) / subTot; // 개별 할인
  return itemDiscount; // 기본 할인율 반환
};

// 대량 구매 할인 적용 함수
export const applyBulkDiscount = (totalAmt: number, itemCnt: number): number => {
  return itemCnt >= 30 ? totalAmt * 0.25 : 0; // 30개 이상일 경우 25% 할인
};

// 화요일 할인 적용 함수
export const applyTuesdayDiscount = (totalAmt: number, discRate: number): { finalAmt: number; finalRate: number } => {
  const isTuesday = new Date().getDay() === 2;
  const discountedAmt = isTuesday ? totalAmt * 0.9 : totalAmt;
  const adjustedRate = isTuesday ? Math.max(discRate, 0.1) : discRate;
  return { finalAmt: discountedAmt, finalRate: adjustedRate };
};

// 상품별 총액 계산 함수
export const calculateItemTotal = (val: number, qty: number, discount: number): number => {
  return val * qty * (1 - discount); // 개별 상품에 대한 총액 및 할인 적용
};

// 카트 || 물품 목록에서 찾는 함수
export const findProduct = (products: Product[], id: string): Product | undefined => {
  return products.find((prod) => prod.id === id);
};
