import { createContext } from 'react';
import { CartContextType } from '../../types/Cart';

const defaultCartContext: CartContextType = {
  cart: [],
  products: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updateProductPrice: () => {},
};

export const CartContext = createContext<CartContextType>(defaultCartContext);
