import { CartList } from './components/CartList';
import { CartSummary } from './components/CartSummary';
import { ProductSelector } from './components/ProductSelector';
import { useCart } from './hooks/useCart';
import { useCartSummary } from './hooks/useCartSummary';
import { useInitializeSales } from './hooks/useInitializeSales';

export const App = () => {
  const {
    cartList,
    deleteCart,
    lastSelectedId,
    handleUpsertCart,
    stockList,
    updateStockPrice,
  } = useCart();
  const cartSummary = useCartSummary(cartList);

  useInitializeSales({ lastSelectedId, stockList, updateStockPrice });

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <CartSummary cartSummary={cartSummary} />
        <CartList
          cartList={cartList}
          handleUpsertCart={handleUpsertCart}
          handleDeleteCart={deleteCart}
        />

        <ProductSelector
          defaultValue={stockList[0].id}
          handleUpsertCart={(selectedId) => handleUpsertCart(selectedId)}
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
