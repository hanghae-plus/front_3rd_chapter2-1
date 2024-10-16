import { create } from 'zustand';

export const useStore = create((set) => ({
  cartItems: [],
  addCartItems: (newCartItem) => set((state) => ({ cartItems: [...state.cartItems, newCartItem] })),
}));
