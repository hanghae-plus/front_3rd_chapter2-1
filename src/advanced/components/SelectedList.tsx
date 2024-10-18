import React from "react";
import { ItemType } from "../types/itemType";

interface SelectedListProps {
  itemData: ItemType;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

const SelectedList: React.FC<SelectedListProps> = ({
  itemData,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {itemData.name} - {itemData.value}원 x {itemData.quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onUpdateQuantity(itemData.id, -1)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onUpdateQuantity(itemData.id, 1)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemoveItem(itemData.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default SelectedList;
