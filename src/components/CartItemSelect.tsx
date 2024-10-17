import React from "react";
import { CartItem } from "../types/types";

export const CartItemSelect: React.FC<{
  item: CartItem;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>{`${item.name} - ${item.value}원 x ${item.cartQuantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onQuantityChange(item.id, -1)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onQuantityChange(item.id, 1)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemove(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
