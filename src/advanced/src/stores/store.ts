import { create } from 'zustand';
import { CartItem } from '../types/cart';

type State = {
  cartItems: CartItem[];
};

type Action = {
  updateCartItems: (updatedCartItems: State['cartItems']) => void;
};

export const useStore = create<State & Action>((set) => ({
  cartItems: [],
  updateCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
}));
