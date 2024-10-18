import React from 'react';
import { useProductsStore, useCartStore } from '../stores';

export const Products: React.FC = () => {
  const { products } = useProductsStore();
  const { addToCart } = useCartStore();
  const [selectedProductId, setSelectedProductId] = React.useState<string>('p1');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('event.target.value:', event.target.value);
    setSelectedProductId(event.target.value);
  };

  const handleAddToCart = () => {
    console.log('selectedProductId:', selectedProductId);
    if (selectedProductId) {
      const selectedProduct = products.find((product) => product.id === selectedProductId);
      if (!selectedProduct) return;
      const { id, name, val } = selectedProduct;
      addToCart({ id, name, val, q: 1 });
    }
  };

  return (
    <>
      <select value={selectedProductId} onChange={handleChange} id="product-select" className="border rounded p-2 mr-2">
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.val}원
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" id="add-to-cart" onClick={handleAddToCart}>
        추가
      </button>
    </>
  );
};
