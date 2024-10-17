import { createContext, useContext } from 'react';

interface ICartContext {
  items: { id: string; name: string; price: number }[];
}
const CartContext = createContext<ICartContext | undefined>(undefined);

const useCartContext = useContext(CartContext);

export { CartContext, useCartContext };
