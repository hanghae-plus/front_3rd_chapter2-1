import React from 'react';

const CartTotalPriceAndPoint: React.FC = () => {
  return (
    <div className="text-xl font-bold my-4">
      <span>총액: 0원</span>
      <span className="text-blue-500 ml-2">(포인트: 0)</span>
    </div>
  );
};

export default CartTotalPriceAndPoint;
