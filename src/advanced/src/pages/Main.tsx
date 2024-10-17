import React from "react";
import CartItem from "../component/CartItem";
import TotalAmount from "../component/TotalAmount";
import ItemSelecter from "../component/ItemSelecter";
import StockStatus from "../component/\bStockStatus";
import CartItemAdit from "../component/CartItemAdit";

const Main: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItemAdit />
        <StockStatus />
      </div>
    </div>
  );
};

export default Main;
