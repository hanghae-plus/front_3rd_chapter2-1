// src/components/StockStatus.tsx
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
    <div id="stock-status" className="text-sm text-gray-500 mt-2 whitespace-pre-line">
      {stockInfo || '모든 상품이 충분히 재고가 있습니다.'}
    </div>
  );
};

export default StockStatus;
