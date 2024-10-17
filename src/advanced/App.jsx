import React, { useRef, useState } from 'react';
import ProductSelect from './components/ProductSelect';
import AddButton from './components/AddButton';
import StockInfo from './components/StockInfo';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';

const App = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartProvider>
          <ProductSelect />
          <Cart />
          <AddButton />
          <StockInfo />
        </CartProvider>
      </div>
    </div>
  );
};

export default App;
