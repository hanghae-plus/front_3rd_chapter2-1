// src/components/Cart.tsx
import React from 'react';
import CartItemComponent from './CartItem';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onQuantityChange, onRemoveItem }) => {
  return (
    <div id="cart-items" className="mb-4">
      {cartItems.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        cartItems.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
          />
        ))
      )}
    </div>
  );
};

export default Cart;
