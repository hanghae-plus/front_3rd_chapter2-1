import React, { ChangeEvent, useState } from 'react';
import { Product } from '../types';

interface ProductSelectProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

const ProductSelect: React.FC<ProductSelectProps> = ({ products, onAddToCart }) => {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  };

  const handleAdd = () => {
    if (selectedId) {
      onAddToCart(selectedId);
      setSelectedId('');
    }
  };

  return (
    <div className="mt-4">
      <select value={selectedId} onChange={handleChange} className="border rounded p-2 mr-2">
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.stock === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedId}
      >
        추가
      </button>
    </div>
  );
};

export default ProductSelect;
