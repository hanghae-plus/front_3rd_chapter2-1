import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

const CartContext = createContext([]);

export const CartProvider = ({ children }) => {
  const [productList, setProductList] = useState([
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ]);
  const [cartItemList, setCartItemList] = useState([]);
  const [cartInfo, setCartInfo] = useState({
    totalAmount: 0,
    itemCount: 0,
    bonusPoint: 0,
    lastAddedProduct: '',
  });

  const selectRef = useRef(null);

  const updateProductList = (id, attribute, value) => {
    setProductList((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, [attribute]: value };
        }
        return item;
      });
    });
  };

  const updateCartItemList = (id, attribute, value) => {
    setCartItemList((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, [attribute]: value };
        }
        return item;
      });
    });
  };

  const createCartItem = (targetProduct) => {
    setCartItemList([{ ...targetProduct, quantity: 1 }]);
  };

  const updateCartInfo = (attribute, value) => {
    setCartInfo((prev) => ({ ...prev, [attribute]: value }));
  };

  const cartValue = useMemo(
    () => ({
      productList,
      updateProductList,
      selectRef,
      cartItemList,
      createCartItem,
      updateCartItemList,
      cartInfo,
      updateCartInfo,
    }),
    [productList, cartItemList],
  );

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('CartContext is not provided');
  }
  return cartContext;
};
