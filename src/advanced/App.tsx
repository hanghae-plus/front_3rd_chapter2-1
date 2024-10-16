import { useState } from 'react';
import { CartTotal } from './components/CartTotal';
import { DEFAULT_CART_TOTAL, CartTotal as TCartTotal } from './model/cartTotal';

export const App = () => {
  const [cartTotal, setCartTotal] = useState<TCartTotal>(DEFAULT_CART_TOTAL);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <CartTotal cartTotal={cartTotal} />
      </div>
    </div>
  );
};
