import React from 'react';
import { Button } from '../atoms';
import { CartItem } from '../../types';

interface Props {
  cartItems: CartItem[];
  handleQuantityUpdate: (productId: string, changeDirection: 'increase' | 'decrease') => void;
  handleRemoveCartItem: (productId: string) => void;
}

/**
 * @function CartItems
 * @description 장바구니 상품 목록 표시하고, 각 상품의 수량 조정 및 제거 기능을 제공하는 컴포넌트
 *
 * @param {CartItem[]} cartItems - 장바구니에 있는 상품들의 배열
 * @param {function} handleQuantityUpdate - 상품의 수량을 업데이트하는 함수
 * @param {function} handleRemoveCartItem - 상품을 장바구니에서 제거하는 함수
 * @returns {JSX.Element} 상품 목록과 각 상품의 수량 조정 및 제거 버튼을 포함한 JSX 요소를 반환
 */

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
