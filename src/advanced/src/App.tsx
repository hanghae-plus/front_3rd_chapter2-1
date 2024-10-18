import React from 'react';
import CartItem from './components/CartItem';
import CartTotal from './components/CartTotal';
import ProductSelect from './components/ProductSelect';
import StockStatus from './components/StockStatus';
import useCart from './hooks/useCart';

function App() {
  const { cart, productList, addToCart, changeQuantity, totalAmount, discountRate, bonusPoint } = useCart();

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItem cart={cart} productList={productList} handleChangeQuantity={changeQuantity} />
        <CartTotal totalAmount={totalAmount} discountRate={discountRate} bonusPoint={bonusPoint} />
        <ProductSelect handleAddToCart={addToCart} productList={productList} />
        <StockStatus productList={productList} />
      </div>
    </div>
  );
}

export default App;
