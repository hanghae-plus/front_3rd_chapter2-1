import React from "react";
import { Cart } from "../types";

interface CartDisplayProps {
  cart: Cart[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

const CartDisplay: React.FC<CartDisplayProps> = ({ cart, onQuantityChange, onRemove }) => {
  return (
    <div id="cart-items">
      {cart.map((item) => (
        <div key={item.id} id={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - {item.price}원 x {item.cartQuantity}
          </span>
          <div>
            <button
              onClick={() => onQuantityChange(item.id, -1)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            >
              -
            </button>
            <button
              onClick={() => onQuantityChange(item.id, 1)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
            >
              +
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartDisplay;
