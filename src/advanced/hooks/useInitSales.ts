import { useCallback, useEffect, useRef } from 'react';
import { StockList } from '../model/product';
import { UpdateStockPrice } from './useStock';

type Props = {
  stockList: StockList;
  lastSelectedId: string | undefined;
  updateStockPrice: UpdateStockPrice;
};

export const useInitSales = ({
  lastSelectedId,
  stockList,
  updateStockPrice,
}: Props) => {
  const flashSaleTimeoutRef = useRef<number | null>(null);
  const suggestionSaleTimeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (flashSaleTimeoutRef.current) clearTimeout(flashSaleTimeoutRef.current);
    if (suggestionSaleTimeoutRef.current)
      clearTimeout(suggestionSaleTimeoutRef.current);
  };

  /** 번개 세일 시작 */
  const startFlashSale = useCallback(
    (stockList: StockList) => {
      flashSaleTimeoutRef.current = setTimeout(() => {
        const interval = setInterval(() => {
          const discountItem =
            stockList[Math.floor(Math.random() * stockList.length)];
          if (Math.random() < 0.3 && discountItem.quantity > 0) {
            alert(
              '번개세일! ' + discountItem.name + '이(가) 20% 할인 중입니다!'
            );
            updateStockPrice(discountItem.id, () =>
              Math.round(discountItem.price * 0.8)
            );
          }
        }, 30000);

        return () => clearInterval(interval);
      }, Math.random() * 10000);
    },
    [updateStockPrice]
  );

  /** 추천 상품 세일 시작 */
  const startSuggestionSale = useCallback(
    (stockList: StockList, lastSelectedId: string | undefined) => {
      suggestionSaleTimeoutRef.current = setTimeout(() => {
        const interval = setInterval(() => {
          if (!lastSelectedId) return;

          const discountItem = stockList.find(
            (item) => item.id !== lastSelectedId && item.quantity > 0
          );
          if (discountItem) {
            alert(
              discountItem.name +
                '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
            );
            updateStockPrice(lastSelectedId, () =>
              Math.round(discountItem.price * 0.95)
            );
          }
        }, 60000);

        return () => clearInterval(interval);
      }, Math.random() * 20000);
    },
    [updateStockPrice]
  );

  useEffect(() => {
    startFlashSale(stockList);
    startSuggestionSale(stockList, lastSelectedId);

    return () => clearTimers();
  }, [lastSelectedId, startFlashSale, startSuggestionSale, stockList]);
};
