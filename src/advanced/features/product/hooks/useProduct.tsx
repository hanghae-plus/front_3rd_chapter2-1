import { useEffect, useState } from 'react';
import { getProducts } from '../api';
import { IProduct } from '../types';

export const useProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    const products = await getProducts();
    setProducts(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products };
};
