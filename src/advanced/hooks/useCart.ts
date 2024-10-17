import { useCallback, useState } from 'react';
import { StockItem, TCartItem, TCartList } from '../model/product';
import { useStock } from './useStock';

export type HandleUpsertCart = (
  selectedId: string | undefined,
  quantity?: number
) => void;

export type HandleDeleteCart = (targetCartItem: TCartItem) => void;

export const useCart = () => {
  const [cartList, setCartList] = useState<TCartList>([]);
  const { stockList, updateStock } = useStock();

  const addCart = useCallback(
    (targetStockItem: StockItem, quantityToAdd = 1) => {
      updateStock(targetStockItem.id, -quantityToAdd);
      setCartList((prevCartList) => [
        ...prevCartList,
        { ...targetStockItem, quantity: quantityToAdd },
      ]);
    },
    []
  );

  const deleteCart = useCallback((targetCartItem: TCartItem) => {
    updateStock(targetCartItem.id, targetCartItem.quantity);
    setCartList((prevCartList) =>
      prevCartList.filter((item) => item.id !== targetCartItem.id)
    );
  }, []);

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

      updateStock(targetCartItem.id, -quantityToUpdate);
      setCartList((prevCartList) =>
        prevCartList.map((item) =>
          item.id === targetCartItem.id
            ? { ...item, quantity: item.quantity + quantityToUpdate }
            : item
        )
      );
    },
    []
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
    []
  );

  // TODO: useEffect로 cartList 변경될 때마다 calc하면 될듯?

  return { stockList, cartList, handleUpsertCart, deleteCart };
};
