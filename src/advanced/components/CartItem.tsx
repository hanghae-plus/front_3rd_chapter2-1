import React, { useCallback } from 'react';
import { Product } from '../types';
import { useCartStore } from '../stores';

export const CartItem: React.FC<Product> = ({ id, name, val, qty }) => {
  const { updateCartQty, removeItem: rmItem } = useCartStore();

  const decrement = useCallback(() => updateCartQty(id, -1), [id]);
  const increment = useCallback(() => updateCartQty(id, 1), [id]);
  const removeItem = useCallback(() => rmItem(id), [id]);

  return (
    <article id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {val}원 x {qty}
      </span>
      <section className="btns">
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={decrement}>
          -
        </button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={increment}>
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" onClick={removeItem}>
          삭제
        </button>
      </section>
    </article>
  );
};
