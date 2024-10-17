import { createContext, useContext } from 'react';

interface IProductContext {
  products: { id: string; name: string; price: number; stock: number }[];
}
const ProductContext = createContext<IProductContext | undefined>(undefined);

const useProductContext = useContext(ProductContext);

export { ProductContext, useProductContext };
