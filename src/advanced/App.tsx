import { useState } from 'react';
import { CartList } from './components/CartList';
import { CartTotal } from './components/CartTotal/CartTotal';
import { ProductSelector } from './components/ProductSelector/ProductSelector';
import { useCart } from './hooks/useCart';
import { DEFAULT_CART_TOTAL, CartTotal as TCartTotal } from './model/cartTotal';

export const App = () => {
  const { cartList, deleteCart, handleUpsertCart, stockList } = useCart();
  const [cartTotal, setCartTotal] = useState<TCartTotal>(DEFAULT_CART_TOTAL);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <CartTotal cartTotal={cartTotal} />
        <CartList
          cartList={cartList}
          handleUpsertCart={handleUpsertCart}
          handleDeleteCart={deleteCart}
        />

        <ProductSelector
          defaultValue={stockList[0].id}
          handleAddCart={(selectedId) => handleUpsertCart(selectedId)}
          options={stockList.map(({ id, name, price, quantity }) => ({
            value: id,
            label: `${name} - ${price}원`,
            disabled: quantity <= 0,
          }))}
        />
      </div>
    </div>
  );
};
