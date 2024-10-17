import React, { forwardRef } from 'react';
import { useCartContext } from '../context/CartContext';

const ProductSelect = () => {
  const { productList, selectRef } = useCartContext();

  return (
    <select ref={selectRef} id="product-select" className="border rounded p-2 mr-2">
      {productList.length > 0
        ? productList.map((product) => (
            <option key={product.id} value={product.id} disabled={product.quantity === 0}>
              {product.name} - {product.price}원
            </option>
          ))
        : null}
    </select>
  );
};

export default ProductSelect;
