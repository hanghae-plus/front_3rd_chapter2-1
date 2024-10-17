import { useState } from 'react';
import { CartList } from './components/CartList';
import { CartTotal } from './components/CartTotal/CartTotal';
import { ProductSelector } from './components/ProductSelector/ProductSelector';
import { DEFAULT_CART_TOTAL, CartTotal as TCartTotal } from './model/cartTotal';
import {
  CartItem,
  DEFAULT_PRODUCT_LIST,
  StockItem,
  StockList,
  TCartList,
} from './model/product';

export const App = () => {
  const [stockList, setStockList] = useState<StockList>(DEFAULT_PRODUCT_LIST);
  const [cartList, setCartList] = useState<TCartList>([]);
  const [cartTotal, setCartTotal] = useState<TCartTotal>(DEFAULT_CART_TOTAL);

  const updateStock = (
    productId: StockItem['id'],
    quantityToUpdate: StockItem['quantity']
  ) => {
    setStockList((prevStockList) =>
      prevStockList.map((stockItem) =>
        stockItem.id === productId
          ? { ...stockItem, quantity: stockItem.quantity + quantityToUpdate }
          : stockItem
      )
    );
  };

  const addCart = (targetStockItem: StockItem, quantityToAdd = 1) => {
    updateStock(targetStockItem.id, -quantityToAdd);
    setCartList((prevCartList) => [
      ...prevCartList,
      { ...targetStockItem, quantity: quantityToAdd },
    ]);

    // TODO: 카드계산함수 실행
  };

  const updateCart = (
    targetStockItem: StockItem,
    targetCartItem: CartItem,
    quantityToUpdate = 1
  ) => {
    const stockQuantity = targetStockItem?.quantity ?? 0;
    const newQuantity = targetCartItem.quantity + quantityToUpdate;

    if (newQuantity > stockQuantity) {
      alert('재고가 부족합니다.');
      return;
    }

    updateStock(targetCartItem.id, -quantityToUpdate);
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === targetCartItem.id
          ? { ...item, quantity: item.quantity + quantityToUpdate }
          : item
      )
    );
  };

  const handleAddCart = (selectedId: string, quantity = 1) => {
    const targetStockItem = stockList.find(({ id }) => id === selectedId);

    if (!targetStockItem?.quantity) {
      alert('재고가 부족합니다.');
      return;
    }

    const targetCartItem = cartList.find(({ id }) => id === selectedId);

    targetCartItem
      ? updateCart(targetStockItem, targetCartItem, quantity)
      : addCart(targetStockItem, quantity);

    // TODO: 카드계산함수 실행
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <CartTotal cartTotal={cartTotal} />
        <CartList cartList={cartList} />

        <ProductSelector
          defaultValue={stockList[0].id}
          handleAddCart={(selectedId) =>
            selectedId && handleAddCart(selectedId)
          }
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
