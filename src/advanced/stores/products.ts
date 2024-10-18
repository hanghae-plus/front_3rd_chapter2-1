import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
  disc: number;
}

interface ProductsState {
  products: Product[];
  // increase: (by: number) => void;
}

export const useProductsStore = create<ProductsState>()(() => ({
  products: [
    { id: 'p1', name: '상품1', val: 10000, q: 50, disc: 0.1 },
    { id: 'p2', name: '상품2', val: 20000, q: 30, disc: 0.15 },
    { id: 'p3', name: '상품3', val: 30000, q: 20, disc: 0.2 },
    { id: 'p4', name: '상품4', val: 15000, q: 0, disc: 0.05 },
    { id: 'p5', name: '상품5', val: 25000, q: 10, disc: 0.25 },
  ],
  // increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
