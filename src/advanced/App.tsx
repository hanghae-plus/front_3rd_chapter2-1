import { useState } from 'react';
import { CartList } from './components/CartList';
import { CartTotal } from './components/CartTotal/CartTotal';
import { DEFAULT_CART_TOTAL, CartTotal as TCartTotal } from './model/cartTotal';
import { ProductList } from './model/product';

export const App = () => {
  const [cartTotal, setCartTotal] = useState<TCartTotal>(DEFAULT_CART_TOTAL);
  const [cartList, setCartList] = useState<ProductList>([]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <CartTotal cartTotal={cartTotal} />
        <CartList cartList={cartList} />
      </div>
    </div>
  );
};
