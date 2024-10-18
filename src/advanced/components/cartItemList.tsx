import React from "react";
import { useCart } from "../contexts/CartContext";

const CartItemList = () => {
  const { cartItems, removeItem, updateItemQuantity } = useCart();

  return (
    <div>
      <ul>
        {cartItems.map((item) => (
          <li key={item.product.id}>
            {item.product.name} - {item.product.val}원 x {item.quantity}
            <button
              onClick={() =>
                updateItemQuantity(item.product.id, item.quantity + 1)
              }
            >
              +
            </button>
            <button
              onClick={() =>
                updateItemQuantity(item.product.id, item.quantity - 1)
              }
            >
              -
            </button>
            <button onClick={() => removeItem(item.product.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CartItemList;
