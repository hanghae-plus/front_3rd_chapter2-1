import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";

const ProductSelect: React.FC = () => {
  const { state, dispatch } = useCart();

  const firstProductId = state.products.length > 0 ? state.products[0].id : "";

  useEffect(() => {
    if (firstProductId) {
      dispatch({ type: "SELECT_PRODUCT", productId: firstProductId });
    }
  }, [firstProductId, dispatch]);

  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      defaultValue={firstProductId}
      onChange={(e) => dispatch({ type: "SELECT_PRODUCT", productId: e.target.value })}
    >
      {state.products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.value}원
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
