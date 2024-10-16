import { create } from 'zustand';
import type { ProductModel } from '../types/cart';
import { products } from '../data/products';

type State = {
  products: ProductModel[];
};

type Action = {
  updateStoreProductQuantity: (targetProduct: ProductModel, newQuantity: number) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  products: products,
  updateStoreProductQuantity: (targetProduct: ProductModel, newQuantity: number) =>
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
