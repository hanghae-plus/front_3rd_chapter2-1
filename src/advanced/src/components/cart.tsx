import React from 'react';
import CartItemComponent from './CartItem';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  handleQuantityChange: (productId: string, change: number) => void;
  handleRemoveItem: (productId: string) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, handleQuantityChange, handleRemoveItem }) => {
  return (
    <div id="cart-items" className="mb-4">
      {cartItems.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          handleQuantityChange={handleQuantityChange}
          handleRemoveItem={handleRemoveItem}
        />
      ))}
    </div>
  );
};

export default Cart;
