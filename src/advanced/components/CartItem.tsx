import React, { useCallback } from 'react';
import useCartStore from '../store/userCartStore';
import type { CartItem } from '../store/userCartStore';

interface CartItemProps {
  item: CartItem;
}

// 장바구니에 담긴 상품과 수량 정보를 보여주는 컴포넌트
const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { addCartItem, removeCartItem, clearCartItem } = useCartStore();

  const handleAddCartItem = useCallback(() => {
    addCartItem(item.id);
  }, [addCartItem, item.id]);

  const handleDelCartItem = useCallback(() => {
    removeCartItem(item.id);
  }, [removeCartItem, item.id]);

  const handleClearCartItem = useCallback(() => {
    clearCartItem(item.id);
  }, [clearCartItem, item.id]);

  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {item.name} - {item.price}원 x {item.count}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={handleDelCartItem}
          disabled={item.count <= 0}>
          -
        </button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={handleAddCartItem}>
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" onClick={handleClearCartItem}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
