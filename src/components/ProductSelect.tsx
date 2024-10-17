import { useState } from "react";
import { Product } from "../types/types";
import React from "react";

export const ProductSelect: React.FC<{
  products: Product[];
  onAddToCart: (productId: string) => void;
}> = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  return (
    <div>
      <select
        className="border rounded p-2 mr-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">상품 선택</option>
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.quantity === 0}
          >
            {`${product.name} - ${product.value}원`}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onAddToCart(selectedProduct)}
        disabled={!selectedProduct}
      >
        추가
      </button>
    </div>
  );
};
