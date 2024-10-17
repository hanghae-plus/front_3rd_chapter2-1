import React from 'react';
import { useCartContext } from '../context/CartContext';

const Total = () => {
  const { totalAmount, bonusPoint } = useCartContext();

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalAmount || 0}원
      <span className="text-blue-500 ml-2">(포인트: {bonusPoint || 0})</span>
    </div>
  );
};

export default Total;
