import { create } from 'zustand';
import { IProduct } from '../types/cart';
import { products } from '../data/products';

type State = {
  products: IProduct[];
};

type Action = {
  updateStoreProductQuantity: (targetProduct: IProduct, newQuantity: number) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  products: products,
  updateStoreProductQuantity: (targetProduct: IProduct, newQuantity: number) =>
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id === targetProduct.id) {
          return { ...product, quantity: newQuantity };
        } else {
          return product;
        }
      }),
    })),
}));
