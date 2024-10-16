import React from 'react';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts';

const OutOfStockItems: React.FC = () => {
  return (
    <>
      {DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0).map((product) => (
        <div key={product.id} className="text-sm text-gray-500 mt-2">
          {product.name}:
          {product.quantity > 0 ? '재고 부족' + ` (${product.quantity}개 남음)` : '품절'}
        </div>
      ))}
    </>
  );
};

export default OutOfStockItems;
