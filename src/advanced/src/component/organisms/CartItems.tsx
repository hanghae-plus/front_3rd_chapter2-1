import React from 'react';
import { Button } from '../atoms';
import { CartItem } from '../../types';

interface Props {
  cartItems: CartItem[];
  handleQuantityUpdate: (productId: string, changeDirection: 'increase' | 'decrease') => void;
  handleRemoveCartItem: (productId: string) => void;
}

export const CartItems: React.FC<Props> = ({
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
            <Button
              label="-"
              onClick={() => handleQuantityUpdate(id, 'decrease')}
              className="bg-blue-500 mr-1"
            />
            <Button
              label="+"
              onClick={() => handleQuantityUpdate(id, 'increase')}
              className="bg-blue-500 mr-1"
            />
            <Button label="삭제" onClick={() => handleRemoveCartItem(id)} className="bg-red-500" />
          </div>
        </div>
      ))}
    </div>
  );
};
