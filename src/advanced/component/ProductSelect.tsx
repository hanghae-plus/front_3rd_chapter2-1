import React, { useState } from 'react';

function ProductSelect({ products, onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct);
      setSelectedProduct('');
    }
  };

  return (
    <div>
      <select
        className="border rounded p-2 mr-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.stock === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCart}
      >
        추가
      </button>
    </div>
  );
}

export default ProductSelect;