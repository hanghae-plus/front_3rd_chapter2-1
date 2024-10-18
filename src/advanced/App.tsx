import React from "react";
import CartPage from "./page/CartPage";
import { CartProvider } from "./contexts/CartContext";

const App = () => {
  return (
    <div>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </div>
  );
};

export default App;
