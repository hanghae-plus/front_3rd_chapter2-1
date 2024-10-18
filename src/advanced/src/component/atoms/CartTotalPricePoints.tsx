import React from 'react';

interface CartTotalPricePointsProps {
  totalPrice: number;
  discountRate: number;
  rewardPoints: number;
}

export const CartTotalPricePoints: React.FC<CartTotalPricePointsProps> = ({
  totalPrice,
  discountRate,
  rewardPoints,
}) => (
  <div className="text-xl font-bold my-4">
    <span>총액: {totalPrice}원</span>
    <span className="text-blue-500 ml-2">(포인트: {rewardPoints})</span>
    {discountRate > 0 && (
      <span className="text-green-500 ml-2">
        ({(discountRate * 100).toFixed(1)}% 할인 적용)
      </span>
    )}
  </div>
);
