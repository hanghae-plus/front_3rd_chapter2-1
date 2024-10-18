import React from 'react';
import { CartItem } from './CartItem';
import { useCartStore } from '../stores';

export const CartItems: React.FC = () => {
  const { cart } = useCartStore();

  return (
    <section id="cart-items">
      {cart.map((item) => {
        return <CartItem key={item.id} {...item} />;
      })}
    </section>
  );
};
