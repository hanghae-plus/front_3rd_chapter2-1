import { useCallback, useState } from 'react';
import { DEFAULT_PRODUCT_LIST, StockItem, StockList } from '../model/product';

export type UpdateStockPrice = (
  productId: StockItem['id'],
  priceUpdater: () => StockItem['price']
) => void;

export const useStock = () => {
  const [stockList, setStockList] = useState<StockList>(DEFAULT_PRODUCT_LIST);

  const updateStockQuantity = useCallback(
    (productId: StockItem['id'], quantityToUpdate: StockItem['quantity']) => {
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
