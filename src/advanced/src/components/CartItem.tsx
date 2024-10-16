// src/components/CartItem.tsx
import React from 'react';
import { CartItem as Item } from '../types';

interface CartItemProps {
  item: Item;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemoveItem }) => {
  const handleDecrease = () => {
    onQuantityChange(item.id, -1);
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, 1);
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  return (
    <div id={item.id} className="flex justify-between items-center mb-2">
      <span>
        {item.name} - {item.price}원 x {item.quantity}
      </span>
      <div>
        <button
          onClick={handleDecrease}
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          -
        </button>
        <button
          onClick={handleIncrease}
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
        >
          +
        </button>
        <button
          onClick={handleRemove}
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
