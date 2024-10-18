import React from "react";
import CartItemList from "../components/cartItemList";
import CartTotal from "../components/cartTotal";
import CartItemAdd from "../components/cartItemAdd";
import CartStockStatus from "../components/cartStockStatus";

const CartPage = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItemList />
        <CartTotal />
        <CartItemAdd />
        <CartStockStatus />
      </div>
    </div>
  );
};

export default CartPage;
