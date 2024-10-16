import { create } from 'zustand';
import { ICartItem } from '../types/cart';

type State = {
  cartItems: ICartItem[];
};

type Action = {
  addStoreCartItems: (targetCartItem: ICartItem) => void;
  updateStoreCartItems: (updatedCartItems: State['cartItems']) => void;
  removeStoreCartItem: (targetCartItem: ICartItem) => void;
};

export const useStore = create<State & Action>((set) => ({
  cartItems: [],
  addStoreCartItems: (targetCartItem) => set((state) => ({ cartItems: [...state.cartItems, targetCartItem] })),
  updateStoreCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
  removeStoreCartItem: (targetCartItem) =>
    set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== targetCartItem.id) })),
}));
