// src/components/App.tsx
import React from 'react';
import ProductSelect from './components/ProductSelect';
import Cart from './components/Cart';
import CartTotal from './components/CartTotal';
import StockStatus from './components/StockStatus';
import { productList } from './data/dummy';
import useCart from './hooks/useCart';

const App: React.FC = () => {
  const { products, cartItems, state, addToCart, updateCartItem, removeFromCart } = useCart({
    productList: productList,
  });

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart
          cartItems={cartItems}
          handleQuantityChange={updateCartItem}
          handleRemoveItem={removeFromCart}
        />
        <CartTotal
          totalAmount={state.totalAmount}
          discountRate={state.discountRate}
          bonusPoints={state.bonusPoints}
        />
        <ProductSelect products={products} onAddToCart={addToCart} />
        <StockStatus products={products} />
      </div>
    </div>
  );
};

export default App;
