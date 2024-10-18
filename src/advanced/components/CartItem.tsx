// CartItem.tsx
import React from 'react';
import Button from './common/Button';
import { Product } from '../types/productType';

interface CartItemProps {
  product: Product; // Product 타입을 props로 정의
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const { id, name, price, count } = product;

  return (
    <div className="flex justify-between items-center mb-2" id={id}>
      <span>
        {name} - {price}원 x {count}
      </span>
      <div>
        <Button type="substractCount" dataProductId={id} />
        <Button type="addCount" dataProductId={id} />
        <Button type="removeCart" dataProductId={id} />
      </div>
    </div>
  );
};

export default CartItem;
