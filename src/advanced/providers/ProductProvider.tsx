import { ProductContext } from './../utils/hooks';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Product } from '../types';

export const ProductProvider: React.FC<PropsWithChildren> = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const [productList, setProduct] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ]);

  const getProduct = useCallback(
    (id: string) => {
      return productList.find((product) => product.id === id);
    },
    [productList]
  );

  const setProductQuantity = useCallback(
    (id: string, quantity: number) => {
      return setProduct((prev) => {
        return prev.map((product) =>
          product.id === id ? { ...product, quantity } : product
        );
      });
    },
    [productList]
  );

  const setProductPrice = useCallback(
    (id: string, price: number) => {
      return setProduct((prev) => {
        return prev.map((product) =>
          product.id === id ? { ...product, price } : product
        );
      });
    },
    [productList]
  );

  const value = useMemo(
    () => ({ productList, getProduct, setProductQuantity, setProductPrice }),
    [productList, getProduct, setProductQuantity, setProductPrice]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
