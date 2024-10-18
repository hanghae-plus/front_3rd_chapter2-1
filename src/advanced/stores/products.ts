import { create } from 'zustand';
import { Product } from '../types';

interface ProductsState {
  products: Product[];
  updateProdQty: (id: string, qty: number) => void;
  updateProd: (product: Product) => void;
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  // 상품 목록
  products: [
    { id: 'p1', name: '상품1', val: 10000, qty: 50, disc: 0.1 },
    { id: 'p2', name: '상품2', val: 20000, qty: 30, disc: 0.15 },
    { id: 'p3', name: '상품3', val: 30000, qty: 20, disc: 0.2 },
    { id: 'p4', name: '상품4', val: 15000, qty: 0, disc: 0.05 },
    { id: 'p5', name: '상품5', val: 25000, qty: 10, disc: 0.25 },
  ],
  // 상품 수량 업데이트 함수
  updateProdQty: (id: string, qty: number) => {
    const { products } = get();
    const updatedProducts = products.map((product) => (product.id === id ? { ...product, qty } : product));

    set({ products: updatedProducts });
  },
  // 상품 업데이트 함수
  updateProd: (newProduct: Product) => {
    const { products } = get();
    const updatedProducts = products.map((product) => (product.id === newProduct.id ? newProduct : product));

    set({ products: updatedProducts });
  },
}));
