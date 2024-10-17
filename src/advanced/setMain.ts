import React, { useState, useEffect } from 'react';
import { PRODUCT_LIST } from './data/storeData'
import { updateProductSelect } from './components/productSelect'
import { calculateCart } from './components/cartTotal'
import {
  startLightningSale,
  startSuggestionSale,
} from './components/timeSale'
import { handleAddCart } from './events/handleAddCart'
import { handleCartAction } from './events/handleCartAction'

interface CartContextProps {
  productSelect: HTMLSelectElement | null;
  productList: typeof PRODUCT_LIST;
  cartList: HTMLElement | null;
  cartTotal: HTMLElement | null;
  stockStatus: HTMLElement | null;
}

export function setMain () {
  
  useEffect(() => {
  
    const productSelect = document.getElementById('product-select') as HTMLSelectElement | null;
    const cartTotal = document.getElementById('cart-total') as HTMLElement | null;
    const cartList = document.getElementById('cart-items') as HTMLElement | null;
    const stockStatus = document.getElementById('stock-status') as HTMLElement | null;
    const productList = PRODUCT_LIST;
    const addCartBtn = document.getElementById('add-to-cart') as HTMLButtonElement;
  
    const cartContext = {
      productSelect,
      productList,
      cartList,
      cartTotal,
      stockStatus,
    };
    
    if (productSelect && cartList && cartTotal) {

      updateProductSelect(PRODUCT_LIST, productSelect);
      calculateCart(cartList, PRODUCT_LIST, cartTotal);

      // 할인 이벤트 시작
      startLightningSale(PRODUCT_LIST, updateProductSelect);
      startSuggestionSale(PRODUCT_LIST, null, updateProductSelect);

    }

    addCartBtn.addEventListener('click', () => {
      handleAddCart(cartContext);
    });
    cartList.addEventListener('click', (event) => {
      handleCartAction(event, cartContext);
    });

    
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행됨


};

