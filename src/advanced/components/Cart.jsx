import React from 'react';
import CartItem from './CartItem';
import { useCartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItemList } = useCartContext();

  return (
    <div>
      {cartItemList.length > 0
        ? cartItemList.map((item) => <CartItem key={item.id} product={item} />)
        : null}
    </div>
  );
};

export default Cart;
