import React, { useState } from 'react';
import { CartItem } from '../Cart';

interface Props {
  cartItems: CartItem[];
  handleQuantityUpdate: (productId: string, changeDirection: 'increase' | 'decrease') => void;
  handleRemoveCartItem: (productId: string) => void;
}

const CartItemList: React.FC<Props> = ({
  cartItems,
  handleQuantityUpdate,
  handleRemoveCartItem,
}) => {
  return (
    <div>
      {cartItems.map(({ price, id, name, selectQuantity }) => (
        <div key={id} className="flex justify-between items-center mb-2">
          <span>
            {name} - {price}원 x {selectQuantity || 0}
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityUpdate(id, 'decrease')}
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => handleQuantityUpdate(id, 'increase')}
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemoveCartItem(id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemList;
