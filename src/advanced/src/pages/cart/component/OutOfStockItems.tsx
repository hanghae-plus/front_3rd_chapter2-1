import React from 'react';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts';
import { CartItem } from '../Cart';

interface Props {
  cartItems: CartItem[];
}

const OutOfStockItems: React.FC<Props> = ({ cartItems }) => {
  const soldOutItems = DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0);
  const list = [...soldOutItems, ...cartItems];

  return (
    <>
      {list.map(({ id, name, quantity }) => {
        if (quantity > 5) {
          return;
        }

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
