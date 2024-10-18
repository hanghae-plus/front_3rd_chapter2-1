import React from 'react';
import { useAppContext } from '../context/appContext';
import { ALERT_SHORT_STOCK, PRODUCT_LIST } from '../ts/constants/constants';

export const CartProductList = () => {
  const { cartProductList, productList, setCartProductList, setProductList } = useAppContext();

  const updateCartProductInfo = (productId: string, change: number) => {
    const calcProduct = productList.find((product) => product.id === productId);

    if (change === 1 && calcProduct && calcProduct.stock === 0) {
      alert(ALERT_SHORT_STOCK);
      return;
    }

    setCartProductList((prevCartItems) => {
      const existingProduct = prevCartItems.find((product) => product.id === productId);
      const productInList = productList.find((product) => product.id === productId);

      if (existingProduct && productInList) {
        const newQuantity = existingProduct.stock + change;

        if (newQuantity < 0) {
          alert(ALERT_SHORT_STOCK);
          return prevCartItems; //
        }

        if (newQuantity === 0) {
          return prevCartItems.filter((product) => product.id !== productId);
        }

        return prevCartItems.map((product) =>
          product.id === productId ? { ...product, stock: newQuantity } : product,
        );
      }

      return prevCartItems;
    });

    setProductList((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === productId) {
          const updatedStock = product.stock - change;
          return { ...product, stock: updatedStock };
        }
        return product;
      }),
    );
  };

  const removeItemFromCart = (productId: string) => {
    setCartProductList((prevItems) => prevItems.filter((item) => item.id !== productId));

    const resetProduct = PRODUCT_LIST.find((product) => product.id === productId);

    if (resetProduct) {
      setProductList((prevProductList) =>
        prevProductList.map((product) => {
          if (product.id === productId) {
            return { ...product, stock: resetProduct.stock };
          }
          return product;
        }),
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items">
        {cartProductList.map((product) => (
          <div key={product.id} className="flex justify-between items-center mb-2">
            <span>
              {product.name} - {product.price}원 x {product.stock}
            </span>
            <div>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                onClick={() => updateCartProductInfo(product.id, -1)}>
                -
              </button>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                onClick={() => updateCartProductInfo(product.id, 1)}>
                +
              </button>
              <button
                className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => removeItemFromCart(product.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
