import { useState } from 'react';

import { useCartOperations } from '../hooks';
import { useProductStore } from '../stores';

const ProductSelect = () => {
  const [selectedProduct, setSelectedProduct] = useState('p1');

  const products = useProductStore((state) => state.products);
  const { handleAddToCart } = useCartOperations();

  return (
    <>
      <select
        onChange={(event) => setSelectedProduct(event.target.value)}
        value={selectedProduct}
        id="product-select"
        className="border rounded p-2 mr-2"
      >
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>

      <button
        onClick={() => handleAddToCart(selectedProduct)}
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
