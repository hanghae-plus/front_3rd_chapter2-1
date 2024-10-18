import React from 'react';
import { useAppContext } from '../context/appContext';

export const CartAmountInfo = () => {
  const { productSum, discountSpan, bonusPointsSpan } = useAppContext();
  return (
    <div>
      <div id="cart-total" className="text-xl font-bold my-4">
        {productSum}
        <span className="text-green-500 ml-2">{discountSpan}</span>
        <span id="loyalty-points" className="text-blue-500 ml-2">
          {bonusPointsSpan}
        </span>
      </div>
    </div>
  );
};
