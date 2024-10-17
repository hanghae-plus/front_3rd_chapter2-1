import React from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';

export const ProductList: React.FC = () => {
  const { state, dispatch } = useShoppingCart();

  return (
    <div>
      <select className="border rounded p-2 mr-2">
        {state.products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          const select = document.querySelector('select') as HTMLSelectElement;
          dispatch({ type: 'ADD_TO_CART', productId: select.value });
        }}
      >
        추가
      </button>
    </div>
  );
};
