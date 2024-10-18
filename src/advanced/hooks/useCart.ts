import { useCallback, useState } from 'react';
import { CartItemType, CartListType, StockItemType } from '../model/product';
import { useStockData } from './useStockData';

type AddCart = (targetStockItem: StockItemType, quantityToAdd: number) => void;

type UpdateCart = (
  targetStockItem: StockItemType,
  targetCartItem: CartItemType,
  quantityToUpdate: number
) => void;

export type UpsertCart = (
  selectedId: string | undefined,
  quantity?: number
) => void;

export type DeleteCart = (targetCartItem: CartItemType) => void;

/**
 * 장바구니와 관련된 로직을 관리하는 훅
 * - 상품 추가, 삭제, 업데이트
 * - 장바구니의 총합 계산
 * - 재고 정보 업데이트
 */
export const useCart = () => {
  const [lastSelectedId, setLastSelectedId] = useState('');
  const [cartList, setCartList] = useState<CartListType>([]);
  const { stockList, updateStockQuantity, updateStockPrice } = useStockData();

  const addCart = useCallback<AddCart>(
    (targetStockItem, quantityToAdd = 1) => {
      updateStockQuantity(targetStockItem.id, -quantityToAdd);
      setCartList((prevCartList) => [
        ...prevCartList,
        { ...targetStockItem, quantity: quantityToAdd },
      ]);
    },
    [updateStockQuantity]
  );

  const deleteCart = useCallback<DeleteCart>(
    (targetCartItem: CartItemType) => {
      updateStockQuantity(targetCartItem.id, targetCartItem.quantity);
      setCartList((prevCartList) =>
        prevCartList.filter((item) => item.id !== targetCartItem.id)
      );
    },
    [updateStockQuantity]
  );

  const updateCart = useCallback<UpdateCart>(
    (targetStockItem, targetCartItem, quantityToUpdate = 1) => {
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

  const upsertCart = useCallback<UpsertCart>(
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
    handleUpsertCart: upsertCart,
    deleteCart,
    updateStockPrice,
  };
};
