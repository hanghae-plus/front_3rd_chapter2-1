import { createContext, useContext } from 'react';
import { Cart, Product } from '../types';

interface ProductContextType {
  productList: Product[];
  getProduct: (id: string) => Product | undefined;
  setProductQuantity: (id: string, quantity: number) => void;
  setProductPrice: (id: string, price: number) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error('useProductContext must be used within an ProductProvider');

  return context;
};

interface CartContextType {
  cartList: Cart[];
  getCart: (id: string) => Product | undefined;
  addCart: (cart: Cart) => void;
  setCartQuantity: (id: string, quantity: number) => void;
  setCartPrice: (id: string, price: number) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error('useCartContext must be used within an CartProvider');

  return context;
};
