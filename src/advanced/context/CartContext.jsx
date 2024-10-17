import { createContext, useContext } from 'react';
import { useState } from 'react';
import { productList } from '../data/productData';
import useCart from '../hooks/useCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartHook = useCart();

  return <CartContext.Provider value={cartHook}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
