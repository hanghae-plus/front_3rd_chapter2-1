import React from 'react';
import { prodList } from '../../constant/productList';
import { CartItem } from '../../types';
import { StockList } from '../atoms';

interface Props {
  cartItems: CartItem[];
}
/**
 * @function StockStatus
 * @description 장바구니에 있는 상품들 중 품절이나 재고가 낮은 상품의 상태를 표시하는 컴포넌트
 * 
 * @param {CartItem[]} cartItems - 장바구니에 있는 상품들의 배열
 * @returns {JSX.Element} 품절 및 재고가 낮은 상품을 나열하는 `StockList` 컴포넌트의 JSX 요소를 반환
 */

export const StockStatus: React.FC<Props> = ({ cartItems }) => {
  const soldOutItems = prodList.filter((product) => product.quantity === 0)
    .map(product => ({
      ...product,
      selectQuantity: 0,
    }));
  const lowStockItems = cartItems.filter((item) => item.quantity <= 5 && item.quantity > 0);
  const list = [...soldOutItems, ...lowStockItems];

  return <StockList list={list} />;
};
