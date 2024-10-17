import React from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';

export const Cart: React.FC = () => {
  const { state, dispatch } = useShoppingCart();

  return (
    <div>
      {state.cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - {item.price}원 x {item.quantity}
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.id, change: -1 })}
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.id, change: 1 })}
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: item.id })}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
