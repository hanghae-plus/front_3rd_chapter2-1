import React, { useEffect } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { calculateTotal } from '../utils/calculations';

export const TotalDisplay: React.FC = () => {
  const { state, dispatch } = useShoppingCart();
  const { totalAmount, discountRate, bonusPoints } = calculateTotal(state.cart);

  useEffect(() => {
    dispatch({ type: 'SET_BONUS_POINTS', points: bonusPoints });
  }, [bonusPoints, dispatch]);

  return (
    <div className="text-xl font-bold my-4">
      총액: {Math.round(totalAmount)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {state.bonusPoints})</span>
    </div>
  );
};
