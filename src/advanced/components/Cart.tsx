import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

const Cart: React.FC = () => {
  const { state } = useCart();

  return (
    <div id="cart-items">
      {state.cart.map((cartItem) => {
        const product = state.products.find((p) => p.id === cartItem.id);
        if (!product) return null;
        return <CartItem key={cartItem.id} product={product} quantity={cartItem.quantity} />;
      })}
    </div>
  );
};

export default Cart;
