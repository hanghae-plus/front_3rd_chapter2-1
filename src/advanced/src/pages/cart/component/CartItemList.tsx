import React, { useState } from 'react';
import { CartItems } from '../Cart';

interface Props {
  cartItems: CartItems[];
}

const CartItemList: React.FC<Props> = ({ cartItems }) => {
  return (
    <div>
      {cartItems.map(({ price, id, name, selectQuantity }) => (
        <div key={id} className="flex justify-between items-center mb-2">
          <span>
            {name} - {price}원 x {selectQuantity || 0}
          </span>
          <div>
            <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
              -
            </button>
            <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
              +
            </button>
            <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemList;
