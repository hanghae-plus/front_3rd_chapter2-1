import React from "react";

export const CartTotal = () => {
  return (
    <div id="cart-total" className="my-4 text-xl font-bold">
      총액: 0원
      <span id="loyalty-points" className="ml-2 text-blue-500">
        (포인트: 0)
      </span>
    </div>
  );
};
