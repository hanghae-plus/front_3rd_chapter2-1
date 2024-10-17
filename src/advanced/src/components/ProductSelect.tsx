import React from "react";
import { Product } from "../types";

interface ProductSelectProps {
  products: Product[];
  onAdd: (productId: string) => void;
}

const ProductSelect: React.FC<ProductSelectProps> = ({ products, onAdd }) => {
  const handleAdd = () => {
    const select = document.getElementById("product-select") as HTMLSelectElement;
    const selectedId = select.value;
    if (selectedId) {
      onAdd(selectedId);
      select.value = ""; // Reset selection
    }
  };

  return (
    <div className="mt-4">
      <select id="product-select" className="border rounded p-2 mr-2" defaultValue="">
        <option value="" disabled>
          제품을 선택하세요
        </option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </div>
  );
};

export default ProductSelect;
