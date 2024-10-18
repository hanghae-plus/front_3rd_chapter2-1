import React from 'react';
import { useAppContext } from '../context/appContext';
import { useRender } from './useRender';

const useInterval = () => {
  const { productList, setProductList,setProductSelectDropDown,cartProductList } = useAppContext();

  const { renderProductList } = useRender(); 
  const options =  renderProductList()
  const timeSaleProductRenderer = () => {
    
    if (productList.length > 0) {
      const timeSaleProduct = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && timeSaleProduct.stock > 0) {
        timeSaleProduct.price = Math.round(timeSaleProduct.price * 0.8);
        alert(`번개세일! ${timeSaleProduct.name}이(가) 20% 할인 중입니다!`);

        const updateProductList = productList.map((product) => {
          if (product.id === timeSaleProduct.id) {
            return { ...product, price: timeSaleProduct.price };
          }
          return product;
        });
        setProductList(updateProductList);
        setProductSelectDropDown(<>{options}</>)
      }
    }
  };
  const productSuggestRender = () => {
    const cartProductLength = cartProductList.length;
    if (cartProductLength > 0) {
      const productSuggest = productList[cartProductLength - 0];
      alert(`${productSuggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      const updateProductList = productList.map((product) => {
        if (product.id === productSuggest.id) {
          return { ...product, price: Math.round(productSuggest.price * 0.95) };
        }
        return product;
      });
      setProductList(updateProductList);
      renderProductList();
      setProductSelectDropDown(<>{options}</>);
    }
  };

const timeSaleInterval = setInterval(() => {
    timeSaleProductRenderer();
  }, 30000);

  const suggestInterval = setInterval(() => {
    productSuggestRender();
  }, 60000);



  return { renderProductList,timeSaleInterval,suggestInterval };
};

export { useInterval };



