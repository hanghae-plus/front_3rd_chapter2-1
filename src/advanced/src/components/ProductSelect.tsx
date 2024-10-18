import { useState } from 'react';
import { Product } from '../types';

interface ProductSelect {
  handleAddToCart: (id: string) => void;
  productList: Product[];
}

const ProductSelect = ({ handleAddToCart, productList }: ProductSelect) => {
  const [selectedValue, setSelectedValue] = useState<string>('p1');

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        {productList.map((product: Product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAddToCart(selectedValue)}>
        추가
      </button>
    </>
  );
};

export default ProductSelect;
