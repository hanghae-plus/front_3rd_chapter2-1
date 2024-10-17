import React from 'react';
import CartItem from './components/CartItem';
import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import StockStatus from './components/StockStatus';

function App() {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItem />
        <CartTotal />
        <ProductSelect />
        <StockStatus />
      </div>
    </div>
  );
}

export default App;
