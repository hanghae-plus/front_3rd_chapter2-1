import React from 'react';
import { CartItem } from '../../types';

interface StockListProps {
  list: CartItem[];
}

export const StockList: React.FC<StockListProps> = ({ list }) => {
  return (
    <>
      {list.map(({ id, name, quantity }) => (
        <div key={id} className="text-sm text-gray-500 mt-2">
          {name}:{quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}
        </div>
      ))}
    </>
  );
};
