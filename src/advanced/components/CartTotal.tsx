import React from 'react';
import { useCartStore } from '../stores';

// 할인율 표시 컴포넌트
const DiscountRate: React.FC<{ discRate: string }> = ({ discRate }) => {
  return <span className="text-green-500 ml-2">({discRate}% 할인 적용)</span>;
};

export const CartTotal: React.FC = () => {
  const { totalPrice, discRate, bonusPoint } = useCartStore();

  // 소수 to percentage 변환 소수점 1자리까지 표시
  const discRateDisplay = (discRate * 100).toFixed(1);

  return (
    <section id="cart-total" className="text-xl font-bold my-4">
      <span>총액 : {totalPrice.toLocaleString()}원</span>
      {discRate > 0 && <DiscountRate discRate={discRateDisplay} />}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoint})
      </span>
    </section>
  );
};
