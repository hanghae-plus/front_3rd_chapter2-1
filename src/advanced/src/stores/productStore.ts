import { create } from 'zustand';
import { IProduct } from '../types/cart';
import { products } from '../data/products';

type State = {
  products: IProduct[];
};

type Action = {
  //   updateStoreCartItems: (updatedCartItems: State['cartItems']) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  products: products,
  //   addStoreCartItems: (targetCartItem) => set((state) => ({ cartItems: [...state.cartItems, targetCartItem] })),
  //   updateStoreCartItems: (updatedCartItems) => set(() => ({ cartItems: updatedCartItems })),
  //   removeStoreCartItem: (targetCartItem) =>
  //     set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== targetCartItem.id) })),
}));
