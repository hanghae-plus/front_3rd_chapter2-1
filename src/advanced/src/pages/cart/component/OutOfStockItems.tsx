import React from 'react';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts';
import { CartItem } from '../Cart';

interface Props {
  cartItems: CartItem[];
}

const OutOfStockItems: React.FC<Props> = ({ cartItems }) => {
  const outOfStockProducts = DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0);
  const lowStockCartItems = cartItems.filter((item) => item.quantity <= 5);
  const combinedLowAndOutOfStockItems = [...outOfStockProducts, ...lowStockCartItems];

  return (
    <>
      {combinedLowAndOutOfStockItems.map(({ id, name, quantity }) => {
        return (
          <div key={id} className="text-sm text-gray-500 mt-2">
            {name}:{quantity > 0 ? '재고 부족' + ` (${quantity}개 남음)` : '품절'}
          </div>
        );
      })}
    </>
  );
};

export default OutOfStockItems;
