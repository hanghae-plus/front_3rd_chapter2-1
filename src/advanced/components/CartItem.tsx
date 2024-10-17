import React from "react";
import { useCart } from "../context/CartContext";

type CartItemProps = {
  product: { id: string; name: string; value: number };
  quantity: number;
};

const CartItem: React.FC<CartItemProps> = ({ product, quantity }) => {
  const { dispatch } = useCart();

  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.value}원 x {quantity}
      </span>
      <div>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => dispatch({ type: "UPDATE_QUANTITY", productId: product.id, quantity: quantity - 1 })}
        >
          -
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => dispatch({ type: "UPDATE_QUANTITY", productId: product.id, quantity: quantity + 1 })}
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => dispatch({ type: "REMOVE_FROM_CART", productId: product.id })}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
