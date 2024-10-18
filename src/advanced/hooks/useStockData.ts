import { useCallback, useState } from 'react';
import {
  DEFAULT_PRODUCT_LIST,
  StockItemType,
  StockListType,
} from '../model/product';

export type UpdateStockPrice = (
  productId: StockItemType['id'],
  priceUpdater: () => StockItemType['price']
) => void;

export const useStockData = () => {
  const [stockList, setStockList] =
    useState<StockListType>(DEFAULT_PRODUCT_LIST);

  const updateStockQuantity = useCallback(
    (
      productId: StockItemType['id'],
      quantityToUpdate: StockItemType['quantity']
    ) => {
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
