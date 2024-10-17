import { useDecreaseToCart } from '@advanced/hooks/cart/useDecreaseToCart';
import { useRemoveToCart } from '@advanced/hooks/cart/useRemoveToCart';
import { useAddToCart } from '@advanced/hooks/cart/useAddToCart';
import { map } from 'lodash-es';
import React from 'react';

const ItemsInCart: React.FC<{ items: ItemType[] }> = ({ items }) => {
  const addToCart = useAddToCart();
  const removeToCart = useRemoveToCart();
  const decreaseToCart = useDecreaseToCart();

  const handleAddToCart = (id: string) => addToCart(id);

  const handleRemoveToCart = (id: string) => removeToCart(id);

  const handleDecreaseToCart = (id: string) => decreaseToCart(id);

  return (
    <div id="cart-items" data-testid="cart-items">
      {map(items, ({ id, name, price, quantity }) => (
        <div
          key={`${id}-${name}`}
          id={id}
          data-testid={id}
          className="flex justify-between items-center mb-2"
        >
          <span role={`${id}-cart-data-label`}>
            {name} - {price}원 x {quantity}
          </span>
          <div>
            <button
              data-testid={`${id}-item-decrease-btn`}
              onClick={() => handleDecreaseToCart(id)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            >
              -
            </button>
            <button
              data-testid={`${id}-item-increase-btn`}
              onClick={() => handleAddToCart(id)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            >
              +
            </button>
            <button
              data-testid={`${id}-item-remove-btn`}
              onClick={() => handleRemoveToCart(id)}
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsInCart;
