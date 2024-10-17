import React, { useEffect, useState } from "react";
import SelectedList from "./SelectedList";
import { ItemType } from "../types/itemType";

interface CartListProps {
  cartItems: ItemType[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartList: React.FC<CartListProps> = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.value * item.quantity, 0);
    setTotalAmount(total);
    const POINTS_CONVERSION_RATE = 1000;
    setBonusPoints(Math.floor(total / POINTS_CONVERSION_RATE));
  }, [cartItems]);

  return (
    <div>
      {cartItems.length > 0 &&
        cartItems.map(item => (
          <SelectedList
            key={item.id}
            itemData={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      <div className="text-xl font-bold my-4">
        총액 : {totalAmount}원 <span className="text-blue-500 ml-2">(포인트: {bonusPoints})</span>
      </div>
    </div>
  );
};

export default CartList;
