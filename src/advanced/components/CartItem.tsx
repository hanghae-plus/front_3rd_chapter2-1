import React from 'react';
import { useCartStore } from '../stores';

interface CartItemProps {
  id: string;
  name: string;
  val: number;
  q: number;
}

export const CartItem: React.FC<CartItemProps> = ({ id, name, val, q }) => {
  const { cartQuantityChange } = useCartStore();

  const handelQuantityChange = (sign: string) => {
    cartQuantityChange(id, sign);
  };

  return (
    <article className="flex justify-between items-center mb-2" id="p1">
      <span>
        {name} - {val}원 x {q}
      </span>
      <section className="btns">
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handelQuantityChange('minus')}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handelQuantityChange('plus')}
        >
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">삭제</button>
      </section>
    </article>
  );
};
