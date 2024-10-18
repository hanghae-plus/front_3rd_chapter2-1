import React, { useState, useCallback } from 'react';
import { useProductsStore, useCartStore } from '../stores';

export const ProductsSelection: React.FC = () => {
  const { products } = useProductsStore();
  const { addToCart } = useCartStore();

  const [selectedProductId, setSelectedProductId] = useState<string>('p1');

  // 상품 선택이 변경될 때 호출되는 함수
  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('event.target.value:', event.target.value);
    setSelectedProductId(event.target.value);
  }, []);

  // 상품을 장바구니에 추가하는 함수
  const handleAddToCart = useCallback(() => {
    console.log('selectedProductId:', selectedProductId);
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    if (!selectedProduct) return;

    const { id, name, val } = selectedProduct;
    addToCart({ id, name, val, qty: 1 });
  }, [selectedProductId]);

  return (
    <>
      <select value={selectedProductId} onChange={handleChange} id="product-select" className="border rounded p-2 mr-2">
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.qty === 0}>
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
