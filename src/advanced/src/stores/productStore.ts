import { create } from 'zustand';
import type { ProductModel } from '../types/cart';
import { products } from '../data/products';

type State = {
  products: ProductModel[];
  lastAddedProduct: ProductModel | null;
};

type Action = {
  updateProductQuantity: (targetProduct: ProductModel, newQuantity: number) => void;
  updateProductPrice: (targetProduct: ProductModel, newPrice: number) => void;
  updateLastAddedProduct: (targetProduct: ProductModel) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  products: products,
  lastAddedProduct: null,

  updateProductQuantity: (targetProduct, newQuantity) =>
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id === targetProduct.id) {
          return { ...product, quantity: newQuantity };
        } else {
          return product;
        }
      }),
    })),
  updateProductPrice: (targetProduct, newPrice) => {
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id === targetProduct.id) {
          return { ...product, price: newPrice };
        } else {
          return product;
        }
      }),
    }));
  },
  updateLastAddedProduct: (product) => set(() => ({ lastAddedProduct: product })),
}));
