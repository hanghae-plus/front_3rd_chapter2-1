import React from 'react';

type PropsType = {
  totalPrice: number;
  discount: string;
  point: number;
};

const CartTotalLabel: React.FC<PropsType> = ({
  totalPrice,
  discount,
  point,
}) => {
  return (
    <div
      id="cart-total"
      data-testid="cart-total"
      className="text-xl font-bold my-4"
    >
      <span>총액: {totalPrice}원</span>
      {+discount > 0 && (
        <span className="text-green-500 ml-2">({discount}% 할인 적용)</span>
      )}
      <span
        id="loyalty-points"
        data-testid="loyalty-points"
        className="text-blue-500 ml-2"
      >
        (포인트: {point})
      </span>
    </div>
  );
};

export default CartTotalLabel;
