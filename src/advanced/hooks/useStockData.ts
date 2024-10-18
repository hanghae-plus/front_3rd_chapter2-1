import { useCallback, useState } from 'react';
import {
  DEFAULT_PRODUCT_LIST,
  StockItemType,
  StockListType,
} from '../model/product';

type UpdateStockQuantity = (
  productId: StockItemType['id'],
  quantityToUpdate: StockItemType['quantity']
) => void;

export type UpdateStockPrice = (
  productId: StockItemType['id'],
  priceUpdater: () => StockItemType['price']
) => void;

/**
 * 재고 데이터를 관리하는 훅
 * */
export const useStockData = () => {
  const [stockList, setStockList] =
    useState<StockListType>(DEFAULT_PRODUCT_LIST);

  /** 재고 수량 업데이트 */
  const updateStockQuantity = useCallback<UpdateStockQuantity>(
    (productId, quantityToUpdate) => {
      setStockList((prevStockList) =>
        prevStockList.map((stockItem) =>
          stockItem.id === productId
            ? { ...stockItem, quantity: stockItem.quantity + quantityToUpdate }
            : stockItem
        )
      );
    },
    []
  );

  /** 재고 가격 업데이트 */
  const updateStockPrice = useCallback<UpdateStockPrice>(
    (productId, priceUpdater) => {
      setStockList((prevStockList) =>
        prevStockList.map((stockItem) => {
          if (stockItem.id !== productId) return stockItem;

          return { ...stockItem, price: priceUpdater() };
        })
      );
    },
    []
  );

  return {
    stockList,
    updateStockQuantity,
    updateStockPrice,
  };
};
