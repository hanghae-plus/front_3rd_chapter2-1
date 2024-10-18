import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  cartQuantityChange: (id: string, sign: string) => void;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: [],
  addToCart: (product: Product) => {
    set((state) => {
      const found = state.cart.find((p) => p.id === product.id);
      if (found) {
        // 이미 있는 상품이면 수량만 증가
        return {
          cart: state.cart.map((p) => (p.id === product.id ? { ...p, q: p.q + 1 } : p)),
        };
      } else {
        // 새 상품 추가
        return {
          cart: [...state.cart, { ...product, q: 1 }],
        };
      }
    });
  },
  // 수량 조절 함수
  cartQuantityChange: (id: string, sign: string) => {
    set((state) => {
      return {
        cart: state.cart.map((p) => {
          if (p.id === id) {
            if (sign === 'plus') {
              return { ...p, q: p.q + 1 };
            }
            if (sign === 'minus') {
              return { ...p, q: p.q - 1 };
            }
          }
          return p;
        }),
      };
    });
  },
}));
