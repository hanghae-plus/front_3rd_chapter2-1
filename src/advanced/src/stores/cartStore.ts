import { create } from 'zustand';
import type { CartItemModel } from '../types/cart';

type State = {
  cartItems: CartItemModel[];
};

type Action = {
  addStoreCartItems: (targetCartItem: CartItemModel) => void;
  updateStoreCartItems: (updatedCartItems: State['cartItems']) => void;
  removeStoreCartItem: (targetCartItem: CartItemModel) => void;
};

export const useCartStore = create<State & Action>((set) => ({
  cartItems: [],
  addStoreCartItems: (targetCartItem) => set((state) => ({ cartItems: [...state.cartItems, targetCartItem] })),
  updateStoreCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
  removeStoreCartItem: (targetCartItem) =>
    set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== targetCartItem.id) })),
}));
