import { useCallback, useState } from 'react';
import { StockItem, TCartItem, TCartList } from '../model/product';
import { useStock } from './useStock';

export type HandleUpsertCart = (
  selectedId: string | undefined,
  quantity?: number
) => void;

export type HandleDeleteCart = (targetCartItem: TCartItem) => void;

export const useCart = () => {
  const [lastSelectedId, setLastSelectedId] = useState('');
  const [cartList, setCartList] = useState<TCartList>([]);
  const { stockList, updateStockQuantity, updateStockPrice } = useStock();

  const addCart = useCallback(
    (targetStockItem: StockItem, quantityToAdd = 1) => {
      updateStockQuantity(targetStockItem.id, -quantityToAdd);
      setCartList((prevCartList) => [
        ...prevCartList,
        { ...targetStockItem, quantity: quantityToAdd },
      ]);
    },
    [updateStockQuantity]
  );

  const deleteCart = useCallback<HandleDeleteCart>(
    (targetCartItem: TCartItem) => {
      updateStockQuantity(targetCartItem.id, targetCartItem.quantity);
      setCartList((prevCartList) =>
        prevCartList.filter((item) => item.id !== targetCartItem.id)
      );
    },
    [updateStockQuantity]
  );

  const updateCart = useCallback(
    (
      targetStockItem: StockItem,
      targetCartItem: TCartItem,
      quantityToUpdate = 1
    ) => {
      const stockQuantity = targetStockItem?.quantity ?? 0;
      const newQuantity = targetCartItem.quantity + quantityToUpdate;

      if (newQuantity > stockQuantity) {
        alert('재고가 부족합니다.');
        return;
      }

      if (newQuantity <= 0) {
        deleteCart(targetCartItem);
        return;
      }

      setLastSelectedId(targetCartItem.id);
      updateStockQuantity(targetCartItem.id, -quantityToUpdate);
      setCartList((prevCartList) =>
        prevCartList.map((item) =>
          item.id === targetCartItem.id
            ? { ...item, quantity: item.quantity + quantityToUpdate }
            : item
        )
      );
    },
    [deleteCart, updateStockQuantity]
  );

  const handleUpsertCart: HandleUpsertCart = useCallback(
    (selectedId, quantity = 1) => {
      if (!selectedId) return;

      const targetStockItem = stockList.find(({ id }) => id === selectedId);
      if (!targetStockItem?.quantity) {
        alert('재고가 부족합니다.');
        return;
      }

      const targetCartItem = cartList.find(({ id }) => id === selectedId);
      targetCartItem
        ? updateCart(targetStockItem, targetCartItem, quantity)
        : addCart(targetStockItem, quantity);
    },
    [addCart, cartList, stockList, updateCart]
  );

  return {
    stockList,
    cartList,
    lastSelectedId,
    handleUpsertCart,
    deleteCart,
    updateStockPrice,
  };
};
