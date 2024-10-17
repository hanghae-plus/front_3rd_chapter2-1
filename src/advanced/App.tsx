import React, { useEffect } from "react";
import { useCart } from "./context/CartContext";
import Cart from "./components/Cart";
import ProductSelect from "./components/ProductSelect";
import TotalSumDisplay from "./components/TotalSumDisplay";
import StockInfo from "./components/StockInfo";

const App: React.FC = () => {
  const { state, dispatch } = useCart();

  // 장바구니 계산
  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTALS" });
  }, [state.cart]);

  return (
    <div className="app bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart />
        <TotalSumDisplay />
        <ProductSelect />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => dispatch({ type: "ADD_TO_CART", productId: state.selectedProduct })}
        >
          추가
        </button>
        <StockInfo />
      </div>
    </div>
  );
};

export default App;
