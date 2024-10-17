import React from "react";
import { useCart } from "../context/CartContext";

const StockInfo: React.FC = () => {
  const { state } = useCart();

  return (
    <div>
      {state.products.map((product) => (
        <div key={product.id} className="text-sm text-gray-500 mt-2">
          {product.name}: {product.quantity > 0 ? `재고 (${product.quantity}개 남음)` : "품절"}
        </div>
      ))}
    </div>
  );
};

export default StockInfo;
