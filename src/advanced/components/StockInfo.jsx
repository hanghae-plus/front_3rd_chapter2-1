import React from 'react';
import { useCartContext } from '../context/CartContext';
import useDiscounts from '../hooks/useDiscount';

const StockInfo = () => {
  useDiscounts();
  const { products } = useCartContext();

  const lowStockProducts = products?.filter((product) => product.q < 5);

  if (lowStockProducts?.length === 0) return null;

  return (
    <div className="text-sm text-gray-500 mt-2">
      {lowStockProducts?.map((product) => (
        <span key={product.id} className="mr-2">
          {product.name}: {product.q > 0 ? `재고부족 (${product.q}개 남음)` : '품절'}
        </span>
      ))}
    </div>
  );
};

export default StockInfo;
