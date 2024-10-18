import React from 'react';
import { useAppContext } from '../context/appContext';

const useRender = () => {
  const { productList, setBonusPointsSpan } = useAppContext();

  //select 상품 리스트 렌더링
  const renderProductList = () => {
    return productList.map((product) => (
      <option key={product.id} value={product.id} disabled={product.stock === 0 ? true : false}>
        {`${product.name} - ${product.price}원`}
      </option>
    ));
  };

  //보너스 포인트 세팅
  const renderBonusPoints = (totalAmount: string) => {
    setBonusPointsSpan(totalAmount);
  };

  return { renderProductList, renderBonusPoints };
};

export { useRender };
