import React from 'react';
import { prodList } from '../../constant/productList';
import { CartItem } from '../../types';
import { StockList } from '../atoms';

interface Props {
  cartItems: CartItem[];
}

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
