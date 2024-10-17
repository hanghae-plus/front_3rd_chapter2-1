import React, { useEffect, useState } from 'react';
import { CartItem } from '../Cart';

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

const TUESDAY_DISCOUNT_RATE = 0.1;
const TUESDAY_DAY_INDEX = 2;

function getItemDiscount(curItem, quantity) {
  return quantity >= 10 ? DISCOUNT_RATES[curItem.id] || 0 : 0;
}

function calculateBulkDiscount(subTotal, totalPrice, totalQuantity) {
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalPrice;
    if (bulkDiscount > itemDiscount) {
      return BULK_DISCOUNT_RATE;
    }
    return itemDiscount / subTotal;
  }
  return (subTotal - totalPrice) / subTotal;
}

function applyTuesdayDiscount(totalPrice, discountRate) {
  const dayIndex = new Date().getDay();
  if (dayIndex === TUESDAY_DAY_INDEX) {
    totalPrice *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }
  return { updatedTotalPrice: totalPrice, updatedDiscountRate: discountRate };
}

function calculateRewardPoints(totalPrice) {
  return Math.floor(totalPrice / 1000);
}

function calculateCartTotals(cartItems) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let subTotal = 0;
  let discountRate = 0;

  if (!cartItems.length) {
    return {
      totalPrice,
      discountRate,
      rewardPoints: 0,
    };
  }

  cartItems.forEach((cartItem) => {
    const cartSelectQuantity = cartItem.selectQuantity;
    const cartTotalPrice = cartItem.price * cartSelectQuantity;
    const itemDiscount = getItemDiscount(cartItem, cartSelectQuantity);

    subTotal += cartTotalPrice;
    totalQuantity += cartSelectQuantity;
    totalPrice += cartTotalPrice * (1 - itemDiscount);
  });

  discountRate = calculateBulkDiscount(subTotal, totalPrice, totalQuantity);

  const { updatedTotalPrice, updatedDiscountRate } = applyTuesdayDiscount(totalPrice, discountRate);

  const rewardPoints = calculateRewardPoints(updatedTotalPrice);

  return {
    totalPrice: updatedTotalPrice,
    discountRate: updatedDiscountRate,
    rewardPoints,
  };
}

const CartTotalPriceAndPoint: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const { totalPrice, discountRate, rewardPoints } = calculateCartTotals(cartItems);

  return (
    <div className="text-xl font-bold my-4">
      <span>총액: {totalPrice}원</span>
      <span className="text-blue-500 ml-2">(포인트: {rewardPoints})</span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};

export default CartTotalPriceAndPoint;
