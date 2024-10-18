import { create } from 'zustand';
import { Product } from '../types';
import { useProductsStore } from './products';
import {
  updateQty,
  calculateCartTotals,
  calculateDiscount,
  applyBulkDiscount,
  applyTuesdayDiscount,
  findProduct,
} from '../utils';

// 장바구니 상태 인터페이스
interface CartState {
  cart: Product[];
  totalPrice: number;
  discRate: number;
  bonusPoint: number;
  lastAdded: string;
  addToCart: (product: Product) => void;
  updateCartQty: (id: string, value: number) => void;
  removeItem: (id: string) => void;
  calcTotalPrice: () => void;
  calcBonusPoint: () => void;
  updateAllValues: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  totalPrice: 0,
  discRate: 0,
  bonusPoint: 0,
  lastAdded: '',
  // 장바구니에 상품 추가
  addToCart: (newProd: Product) => {
    const { cart, updateCartQty, calcTotalPrice } = get();
    // 이미 있는 상품인지 확인
    const curProd = findProduct(cart, newProd.id);
    const newQty = 1;

    // 새 상품 추가
    if (!curProd) set({ cart: [...cart, { ...newProd, qty: 0 }] });

    // 이미 있는 상품이면 수량만 증가
    updateCartQty(newProd.id, newQty);
    calcTotalPrice();
  },
  // 수량 조절 함수
  updateCartQty: (id: string, value: number) => {
    const { cart, removeItem, calcTotalPrice } = get();
    const { products, updateProdQty } = useProductsStore.getState();

    const prod = findProduct(cart, id);
    const remainingQty = findProduct(products, id)?.qty ?? 0;

    if (value > 0 && remainingQty === 0) return alert('재고가 없습니다.');
    if (prod && prod.qty + value <= 0) return removeItem(id);

    const newCart = updateQty(cart, id, value);

    set({ cart: newCart, lastAdded: id });
    updateProdQty(id, remainingQty - value);
    calcTotalPrice();
  },
  // 상품 삭제
  removeItem: (id: string) => {
    const { cart, calcTotalPrice } = get();
    const { products, updateProdQty } = useProductsStore.getState();

    const curQty = cart.find((prod) => prod.id === id)?.qty ?? 0;
    const curProdQty = products.find((prod) => prod.id === id)?.qty ?? 0;
    const newCart = cart.filter((prod) => prod.id !== id);

    set({ cart: newCart });
    updateProdQty(id, curProdQty + curQty);
    calcTotalPrice();
  },
  // 총액 계산
  calcTotalPrice: () => {
    const { cart, calcBonusPoint } = get();
    const { products } = useProductsStore.getState();

    // 장바구니 총액, 총 수량, 총합 계산
    const { totalAmt, itemCnt, subTot } = calculateCartTotals(cart, products);

    // 대량 구매 할인 적용
    const bulkDiscount = applyBulkDiscount(totalAmt, itemCnt);
    const totalAmtAfterBulk = totalAmt - bulkDiscount;

    // 개별 할인율 계산
    const discRate = calculateDiscount(subTot, totalAmtAfterBulk);

    // 화요일 추가 할인 적용
    const { finalAmt: finalTotalAmt, finalRate: finalDiscRate } = applyTuesdayDiscount(totalAmtAfterBulk, discRate);

    // 최종 계산된 총액 및 할인율을 상태에 저장
    set({
      totalPrice: Math.round(finalTotalAmt),
      discRate: finalDiscRate,
    });
    calcBonusPoint();
  },
  // 보너스 포인트 계산
  calcBonusPoint: () => {
    const { totalPrice } = get();
    const bonusPoint = Math.floor(totalPrice / 1000);

    set({ bonusPoint });
  },
  updateAllValues: () => {
    const { products } = useProductsStore.getState();
    const { cart, calcTotalPrice } = get();

    const newCart = cart.map((prod): Product => {
      const { val } = products.find((p) => p.id === prod.id) ?? { val: 0 };
      return { ...prod, val };
    });

    set({ cart: newCart });
    calcTotalPrice();
  },
}));
