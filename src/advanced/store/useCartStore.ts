import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  count: number;
}

interface CartState {
  productList: Product[];
  cartList: Product[];
  getCartEntry: (productId: string) => Product | undefined; // 장바구니에서 제품 찾기
  getProductEntry: (productId: string) => Product | undefined; // 제품 목록에서 제품 찾기
  addToCart: (productId: string) => void;
  substractToCart: (productId: string) => void;
  removeToCart: (productId: string) => void;
}

const useCartStore = create<CartState>((set, get) => ({
  productList: [
    { id: 'p1', name: '상품1', price: 10000, count: 50 },
    { id: 'p2', name: '상품2', price: 20000, count: 30 },
    { id: 'p3', name: '상품3', price: 30000, count: 20 },
    { id: 'p4', name: '상품4', price: 15000, count: 0 },
    { id: 'p5', name: '상품5', price: 25000, count: 10 },
  ],
  cartList: [],

  // 장바구니에 있는 제품 찾기
  getCartEntry: (productId) => {
    return get().cartList.find((item) => item.id === productId);
  },

  // 제품 목록에서 제품 찾기
  getProductEntry: (productId) => {
    return get().productList.find((item) => item.id === productId);
  },

  addToCart: (productId) =>
    set((state) => {
      const cartEntry = get().getCartEntry(productId);
      const productEntry = get().getProductEntry(productId);

      if (cartEntry) {
        // 이미 장바구니에 있는 경우 수량 증가
        return {
          cartList: state.cartList.map((item) => (item.id === productId ? { ...item, count: item.count + 1 } : item)),
        };
      } else {
        if (productEntry) {
          return {
            cartList: [...state.cartList, { ...productEntry, count: 1 }],
          };
        }

        // 찾는 상품이 productList에 없으면 아무 것도 하지 않음
        return state;
      }
    }),

  // 장바구니에서 항목 수량 감소
  substractToCart: (productId) =>
    set((state) => {
      const cartEntry = get().getCartEntry(productId);
      // 수량이 1인 경우 항목을 장바구니에서 제거
      if (cartEntry.count === 1) {
        return {
          cartList: state.cartList.filter((item) => item.id !== productId),
        };
      } else {
        // 수량이 1보다 큰 경우 수량 감소
        return {
          cartList: state.cartList.map((item) => (item.id === productId ? { ...item, count: item.count - 1 } : item)),
        };
      }
    }),

  // 장바구니 항목 제거
  removeToCart: (productId) =>
    set((state) => {
      return {
        cartList: state.cartList.filter((item) => item.id !== productId),
      };
    }),
}));

export default useCartStore;
