import { create } from 'zustand';
import { ICartItem } from '../types/cart';

type State = {
  cartItems: ICartItem[];
};

type Action = {
  updateCartItems: (updatedCartItems: State['cartItems']) => void;
};

export const useStore = create<State & Action>((set) => ({
  cartItems: [],
  updateCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
}));
