import { useEffect, useMemo, useState } from 'react';
import { IProduct } from '../types';
import { OUT_OF_STOCK_ALERT_QUANTITY } from '../constants';

export interface IUseStockProps {
  products: IProduct[];
}

export const useStock = ({ products }: IUseStockProps) => {
  const [stock, setStock] = useState<IProduct[]>(products);

  const addStock = (productId: IProduct['id']) => {
    const foundProduct = products.find(({ id }) => id === productId);
    const foundStock = stock.find(({ id }) => id === productId);

    if (!foundProduct || !foundStock) return false;

    if (foundProduct.q < foundStock.q + 1) {
      alert('재고 부족');
      return false;
    }

    const newStock = stock.map((product) =>
      product.id === productId ? { ...product, q: product.q + 1 } : product
    );
    setStock(newStock);

    return true;
  };

  const minusStock = (productId: IProduct['id']) => {
    const foundStock = stock.find(({ id }) => id === productId);

    if (!foundStock) return false;

    console.log(foundStock);

    if (foundStock.q - 1 < 0) {
      alert('재고 부족');
      return false;
    }

    const newStock = stock.map((product) =>
      product.id === productId ? { ...product, q: product.q - 1 } : product
    );
    setStock(newStock);

    return true;
  };

  const resetStock = (productId: IProduct['id']) => {
    const foundProduct = products.find(({ id }) => id === productId);

    if (!foundProduct) return false;

    setStock((prevStock) =>
      prevStock.map((product) =>
        product.id === productId ? { ...product, q: foundProduct.q } : product
      )
    );

    return true;
  };

  const message = useMemo(
    () =>
      stock
        .map(({ name, q: quantity }) => {
          const isOutOfStock = quantity === 0;
          const isStockRangeReached =
            quantity > 0 && quantity < OUT_OF_STOCK_ALERT_QUANTITY;

          if (isOutOfStock) return `${name}: 품절`;
          if (isStockRangeReached)
            return `${name}: 재고 부족 (${quantity}개 남음)`;

          return '';
        })
        .join(' '),
    [stock]
  );

  useEffect(() => {
    setStock(products);
  }, [products]);

  return { stock, message, addStock, minusStock, resetStock };
};
