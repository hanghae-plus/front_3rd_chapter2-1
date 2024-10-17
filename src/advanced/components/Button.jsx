import React from 'react';
import { useCartContext } from '../context/CartContext';

const Button = ({ children, selectedProduct }) => {
  const { addToCart } = useCartContext();

  const handleButtonClick = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  };
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleButtonClick}
      disabled={!selectedProduct || selectedProduct.q === 0}
    >
      {children}
    </button>
  );
};

export default Button;
