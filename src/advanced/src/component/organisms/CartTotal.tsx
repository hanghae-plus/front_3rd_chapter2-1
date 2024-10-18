import React, { useEffect, useState } from 'react';
import { CartItem } from '../../types';
import { useApplyBulkDiscount, useItemDiscount, useRewardPoints, useSpecialDiscountRate } from '../../hooks';
import { CartTotalPricePoints } from '../atoms';

/**
 * @function CartTotal
 * @description 장바구니의 총액, 적용된 할인율, 그리고 적립된 포인트를 계산하고 표시하는 컴포넌트
 * 
 * @param {CartItem[]} cartItems - 장바구니에 있는 상품들의 배열
 * @returns {JSX.Element} 총 가격, 할인율, 적립 포인트를 표시하는 JSX 요소를 반환
 */

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
    <CartTotalPricePoints
      totalPrice={totals.totalPrice}
      discountRate={totals.discountRate}
      rewardPoints={totals.rewardPoints}
    />
  );
};
