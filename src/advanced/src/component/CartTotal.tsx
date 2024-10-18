import React, { useEffect, useState } from 'react';
import { CartItem } from '../types';
import { useApplyBulkDiscount, useItemDiscount, useRewardPoints,useSpecialDiscountRate } from '../hooks';

export const CartTotal: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const [totals, setTotals] = useState({
    totalPrice: 0,
    discountRate: 0,
    rewardPoints: 0,
  });

  useEffect(() => {
    let subtotal = 0;
    let totalItems = 0;
    let total = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.selectQuantity;
      const discountRate = useItemDiscount(item.id, item.selectQuantity);
      subtotal += itemTotal;
      total += itemTotal * (1 - discountRate);
      totalItems += item.selectQuantity;
    });

    const discountRate = useApplyBulkDiscount(subtotal, total, totalItems);
    const { updatedTotalPrice, updatedDiscountRate } = useSpecialDiscountRate(total, discountRate);
    const rewardPoints = useRewardPoints(updatedTotalPrice);

    setTotals({
      totalPrice: updatedTotalPrice,
      discountRate: updatedDiscountRate,
      rewardPoints,
    });
  }, [cartItems]);

  return (
    <div className="text-xl font-bold my-4">
      <span>총액: {totals.totalPrice}원</span>
      <span className="text-blue-500 ml-2">(포인트: {totals.rewardPoints})</span>
      {totals.discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(totals.discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
    </div>
  );
};
