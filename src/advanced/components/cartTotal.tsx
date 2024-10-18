import React from "react";

const CartTotal = () => {
  return (
    <div className="text-xl font-bold my-4">
      총액: 원<span className="text-green-500 ml-2">할인적용</span>
      <span className="text-blue-500 ml-2">(포인트 : 0)</span>
    </div>
  );
};

export default CartTotal;
