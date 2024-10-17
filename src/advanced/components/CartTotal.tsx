import { useState } from 'react';
interface CartTotalProps {
  totalAmount: number;
  bonusPoints: number;
}

export const CartTotal: React.FC<CartTotalProps> = ({
  totalAmount,
  bonusPoints,
}) => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalAmount}원
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoints})
      </span>
    </div>
  );
};
