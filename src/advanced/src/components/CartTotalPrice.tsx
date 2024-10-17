import { useEffect } from 'react';

import useCartTotalPrice from '../hooks/useCartTotalPrice';
import { useCartStore } from '../stores';
import { discountRateToPercent } from '../utils/discount';

const CartTotalPrice = () => {
  const storeCartItems = useCartStore((state) => state.cartItems);
  const { totalPrice, discountRate, points, calculateDiscountedPriceAndPoints } = useCartTotalPrice();

  useEffect(() => {
    calculateDiscountedPriceAndPoints();
  }, [storeCartItems]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalPrice}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({discountRateToPercent(discountRate)}% 할인 적용)</span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {points})
      </span>
    </div>
  );
};

export default CartTotalPrice;
