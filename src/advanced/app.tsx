import React from "react";
import { CartItemList } from "./components";

const App = () => (
  <div className="bg-gray-100 p-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItemList />
    </div>
  </div>
);

export default App;
