import React from "react";
import { Cart } from "./components/Cart";
import { CartProvider } from "./context/CartContext";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Cart></Cart>
    </CartProvider>
  );
};

export default App;
