import { create } from 'zustand';
import type { CartItemModel, ProductModel } from '../types/cart';

type State = {
  cartItems: CartItemModel[];
};

type Action = {
  addCartItems: (targetCartItem: CartItemModel) => void;
  updateCartItems: (updatedCartItems: State['cartItems']) => void;
  updateCartPrice: (product: ProductModel, newPrice: number) => void;
  removeCartItem: (targetCartItem: CartItemModel) => void;
};

export const useCartStore = create<State & Action>((set) => ({
  cartItems: [],

  addCartItems: (targetCartItem) => set((state) => ({ cartItems: [...state.cartItems, targetCartItem] })),
  updateCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
  updateCartPrice: (product, newPrice) =>
    set((state) => ({
      cartItems: state.cartItems.map((cartItem) => {
        if (cartItem.id === product.id) {
          return { ...cartItem, price: newPrice };
        } else return cartItem;
      }),
    })),
  removeCartItem: (targetCartItem) =>
    set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== targetCartItem.id) })),
}));
