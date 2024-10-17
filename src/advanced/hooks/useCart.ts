import { useContext } from 'react';
import { CartContext } from '../context/cart/CartContext';
import { CartContextType } from '../types/Cart';

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
