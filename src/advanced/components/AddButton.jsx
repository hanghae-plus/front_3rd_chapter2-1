import React from 'react';
import { useCart } from '../hooks/useCart';

const AddButton = () => {
  const { handleAddToCart } = useCart();

  return (
    <button
      onClick={handleAddToCart}
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      추가
    </button>
  );
};

export default AddButton;
