import { useCallback, useState } from 'react';
import { DEFAULT_PRODUCT_LIST, StockItem, StockList } from '../model/product';

export const useStock = () => {
  const [stockList, setStockList] = useState<StockList>(DEFAULT_PRODUCT_LIST);

  const updateStock = useCallback(
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

  return { stockList, updateStock };
};
