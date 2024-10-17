import React, { useEffect, useState } from 'react';
import useCartStore from '../store/userCartStore';
import CartItem from './CartItem';
import { calculatePoints, calculateTotalAmount } from '../Utils/CartUtils';

// 사용자의 장바구니 목록과 금액, 포인트 정보 보여주는 컴포넌트
const CartList: React.FC = () => {
  const cartList = useCartStore((state) => state.cartList);

  return (
    <>
      <div id="cart-items">
        {cartList.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <CartTotalInfo />
    </>
  );
};

// 장바구니 총액, 할인율, 포인트 정보 보여주는 컴포넌트
const CartTotalInfo: React.FC = () => {
  const cartList = useCartStore((state) => state.cartList);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const { totalAmount, discountRate } = calculateTotalAmount(cartList);
    setTotalAmount(totalAmount);
    setDiscountRate(discountRate);
    setPoints(calculatePoints(totalAmount));
  }, [cartList]);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(totalAmount).toLocaleString()}원
      {discountRate > 0 && <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {points.toLocaleString()})
      </span>
    </div>
  );
};

export default CartList;
