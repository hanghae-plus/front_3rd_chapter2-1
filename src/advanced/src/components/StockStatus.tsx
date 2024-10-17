import React from 'react';
import { Product } from '../types';

interface StockStatusProps {
  products: Product[];
}

const StockStatus: React.FC<StockStatusProps> = ({ products }) => {
  const lowStockItems = products.filter((item) => item.stock < 5);
  const stockInfo = lowStockItems
    .map((item) => `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}`)
    .join('\n');

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {stockInfo}
    </div>
  );
};

export default StockStatus;
