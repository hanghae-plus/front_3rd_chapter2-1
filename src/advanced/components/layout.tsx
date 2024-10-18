import React, { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { useCart } from '../hooks/useCart';
import CartProductList from './CartProductList';
import CartAmountInfo from './CartAmountInfo';
import StockInfo from './StockInfo';
import AddToCart from './AddToCart';
import { useRender } from '../hooks/useRender';
import ProductSelectList from './ProductSelectList';
import { useInterval } from '../hooks/useInterval';

const Layout = () => {
  const { setProductSelectDropDown, cartProductList, setSelectedProductId } = useAppContext();

  const { calcCart } = useCart();
  const { renderProductList } = useRender();
  const { timeSaleInterval, suggestInterval } = useInterval();
  const options = renderProductList();

  // 타임세일 및 제품 추천 useEffect
  useEffect(() => {
    return () => {
      clearInterval(timeSaleInterval);
      clearInterval(suggestInterval);
    };
  }, []);

  //select에 값이 세팅이 안 돼 있어서 처음 값을 임의로 지정 위한 useEffect
  useEffect(() => {
    setSelectedProductId('p1');
  }, []);

  //select에 상품정보 리스트 세팅 및 총액 표기를 위한 useEffect
  useEffect(() => {
    setProductSelectDropDown(<>{options}</>);
    calcCart();
  }, [cartProductList]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <CartProductList />
        <CartAmountInfo />
        <div className="flex">
          <ProductSelectList />
          <AddToCart />
        </div>
        <StockInfo />
      </div>
    </div>
  );
};

export default Layout;
