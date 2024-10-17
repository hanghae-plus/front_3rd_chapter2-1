// components/StockInfo.tsx
import React from 'react';
import { Product } from '../types/Cart';

interface StockInfoProps {
  products: Product[];
  lowStockThreshold?: number;
}

const StockInfo: React.FC<StockInfoProps> = ({ products }) => {
  const lowStockItems = products.filter((product) => product.stock < 5);

  return (
    <div className='text-sm text-gray-500 mt-2' id='stock-status'>
      {lowStockItems.map((item) => (
        <div key={item.id}>
          {item.name}:{' '}
          {item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}
        </div>
      ))}
    </div>
  );
};

export default StockInfo;
