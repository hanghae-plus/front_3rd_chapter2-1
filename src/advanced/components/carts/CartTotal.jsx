import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AMOUNT_PER_LOYALTY_POINT } from '../../constants';

export const CartTotal = ({ cartList }) => {
  console.log(cartList);

  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [bonusPoint, setBonusPoint] = useState(0);

  useEffect(() => {
    let currentCartTotalAmount = 0;
    cartList.forEach((cart) => {
      console.log(cart);
      currentCartTotalAmount += cart.price;
    });
    setCartTotalAmount(currentCartTotalAmount);
    setBonusPoint(currentCartTotalAmount / AMOUNT_PER_LOYALTY_POINT);
    console.log(`cartTotalAmount: ${cartTotalAmount}`);
  }, [cartList]);

  return (
    <div id="cart-total" className="my-4 text-xl font-bold">
      총액: {Math.round(cartTotalAmount)}원
      <span id="loyalty-points" className="ml-2 text-blue-500">
        (포인트: {bonusPoint})
      </span>
    </div>
  );
};
