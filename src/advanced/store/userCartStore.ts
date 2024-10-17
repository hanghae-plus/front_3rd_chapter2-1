import { create } from 'zustand';

// 판매할 상품 정보
export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number; // 재고
}

// 장바구니 상품 정보
export interface CartItem {
  id: string;
  name: string;
  price: number;
  count: number; // 장바구니에 담긴 개수
}

// 장바구니 관련 상태와 함수
interface CartStore {
  products: Product[];
  cartList: CartItem[];
  addCartItem: (id: string) => void;
  removeCartItem: (id: string) => void;
  clearCartItem: (id: string) => void;
  updateProductPrice: (id: string, discountRate: number) => void;
}

const useCartStore = create<CartStore>((set) => ({
  products: [
    { id: 'p1', name: '상품1', originalPrice: 10000, price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', originalPrice: 20000, price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', originalPrice: 30000, price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', originalPrice: 15000, price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', originalPrice: 25000, price: 25000, quantity: 10 },
  ],
  cartList: [],

  // 상품 추가 함수
  addCartItem: (id) =>
    set((state) => {
      const product = state.products.find((p) => p.id === id);
      if (!product || product.quantity <= 0) {
        alert('재고가 부족합니다.'); // 재고 부족 시 알림
        return { cartList: state.cartList };
      }

      const existingItem = state.cartList.find((item) => item.id === id);
      const newQuantity = existingItem ? existingItem.count + 1 : 1;

      // 상품 재고 확인 후 재고 없으면 알림
      if (product.quantity <= 0) {
        alert('재고가 부족합니다.');
        return { cartList: state.cartList };
      }

      // 장바구니에 상품 정보 업데이트
      const updatedCartList = existingItem
        ? state.cartList.map((item) => (item.id === id ? { ...item, count: newQuantity } : item))
        : [...state.cartList, { id: product.id, name: product.name, price: product.price, count: newQuantity }];

      // 재고 정보 업데이트
      const updatedProducts = state.products.map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p));

      return { cartList: updatedCartList, products: updatedProducts };
    }),

  // 상품 수량 감소 함수
  removeCartItem: (id) =>
    set((state) => {
      const updatedCartList = state.cartList
        .map((item) => (item.id === id ? { ...item, count: item.count - 1 } : item))
        .filter((item) => item.count > 0);

      // 수량이 0이 된 경우 재고 수량을 다시 증가
      const product = state.products.find((p) => p.id === id);
      if (product) {
        const updatedProducts = state.products.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
        return { cartList: updatedCartList, products: updatedProducts };
      }

      return { cartList: updatedCartList };
    }),

  // 장바구니 항목 초기화 함수
  clearCartItem: (id) =>
    set((state) => {
      const itemToRemove = state.cartList.find((item) => item.id === id);
      if (itemToRemove) {
        const updatedProducts = state.products.map((product) =>
          product.id === id ? { ...product, quantity: product.quantity + itemToRemove.count } : product,
        );
        return {
          cartList: state.cartList.filter((item) => item.id !== id),
          products: updatedProducts,
        };
      }
      return {
        cartList: state.cartList.filter((item) => item.id !== id),
      };
    }),

  // 상품 할인 가격 업데이트 함수
  updateProductPrice: (id, discountRate) =>
    set((state) => {
      const updatedProducts = state.products.map((product) =>
        product.id === id ? { ...product, price: Math.round(product.originalPrice * (1 - discountRate)) } : product,
      );

      // 장바구니 항목에도 최신 가격 반영(할인가)
      const updatedCartList = state.cartList.map((item) => {
        const updatedProduct = updatedProducts.find((p) => p.id === item.id);
        return updatedProduct ? { ...item, price: updatedProduct.price } : item;
      });

      return { products: updatedProducts, cartList: updatedCartList };
    }),
}));

export default useCartStore;
