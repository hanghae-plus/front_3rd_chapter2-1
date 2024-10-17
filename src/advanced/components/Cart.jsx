import React from 'react';
import { useCartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCartContext();

  console.log(cart, 'cartItems');
  return (
    <div id="cart-items" className="mt-4">
      {cart && cart?.length > 0
        ? cart?.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{`${item.name} - ${item.val}원 x ${item.quantity}`}</span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeFromCart(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default Cart;
