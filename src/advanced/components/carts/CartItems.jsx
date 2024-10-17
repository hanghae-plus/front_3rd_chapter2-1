import React from "react";

export const CartItems = () => {
  return (
    <div id="cart-items">
      <div id="p1" className="mb-2 flex items-center justify-between">
        <span>상품1 - 0.2원 x 1</span>
        <div>
          <button
            className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
            data-product-id="${itemToAdd.id}"
            data-change="-1"
          >
            -
          </button>
          <button
            className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
            data-product-id="${itemToAdd.id}"
            data-change="1"
          >
            +
          </button>
          <button
            className="remove-item rounded bg-red-500 px-2 py-1 text-white"
            data-product-id="${itemToAdd.id}"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};
