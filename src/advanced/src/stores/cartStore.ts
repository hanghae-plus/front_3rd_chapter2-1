import { create } from 'zustand';
import type { CartItemModel, ProductModel } from '../types/cart';

type State = {
  cartItems: CartItemModel[];
};

type Action = {
  addStoreCartItems: (targetCartItem: CartItemModel) => void;
  updateStoreCartItems: (updatedCartItems: State['cartItems']) => void;
  updateCartPrice: (product: ProductModel, newPrice: number) => void;
  removeStoreCartItem: (targetCartItem: CartItemModel) => void;
};

export const useCartStore = create<State & Action>((set) => ({
  cartItems: [],

  addStoreCartItems: (targetCartItem) => set((state) => ({ cartItems: [...state.cartItems, targetCartItem] })),
  updateStoreCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
  updateCartPrice: (product, newPrice) =>
    set((state) => ({
      cartItems: state.cartItems.map((cartItem) => {
        if (cartItem.id === product.id) {
          return { ...cartItem, price: newPrice };
        } else return cartItem;
      }),
    })),
  removeStoreCartItem: (targetCartItem) =>
    set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== targetCartItem.id) })),
}));
