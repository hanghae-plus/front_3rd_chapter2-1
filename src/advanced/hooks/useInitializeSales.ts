import { useCallback, useEffect, useRef } from 'react';
import { StockListType } from '../model/product';
import { UpdateStockPrice } from './useStockData';

type Props = {
  stockList: StockListType;
  lastSelectedId: string | undefined;
  updateStockPrice: UpdateStockPrice;
};

const SALE = {
  FLASH: {
    CHANGE: 0.3,
    DISCOUNT: 0.2,
    INTERVAL: 30000, // 30초
    DELAY: 10000, // 10초 이내 랜덤
  },

  SUGGESTION: {
    DISCOUNT: 0.05,
    INTERVAL: 60000, // 60초
    DELAY: 20000, // 20초 이내 랜덤
  },
} as const;

/**
 * 번개 세일 및 추천 상품 세일 이벤트를 초기화하는 훅
 */
export const useInitializeSales = ({
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
    (stockList: StockListType) => {
      flashSaleTimeoutRef.current = setTimeout(() => {
        const interval = setInterval(() => {
          const discountItem =
            stockList[Math.floor(Math.random() * stockList.length)];

          if (Math.random() < SALE.FLASH.CHANGE && discountItem.quantity > 0) {
            alert(
              `번개세일! ${discountItem.name}이(가) ${SALE.FLASH.DISCOUNT * 100}% 할인 중입니다!`
            );
            updateStockPrice(discountItem.id, () =>
              Math.round(discountItem.price * (1 - SALE.FLASH.DISCOUNT))
            );
          }
        }, SALE.FLASH.INTERVAL);

        return () => clearInterval(interval);
      }, Math.random() * SALE.FLASH.DELAY);
    },
    [updateStockPrice]
  );

  /** 추천 상품 세일 시작 */
  const startSuggestionSale = useCallback(
    (stockList: StockListType, lastSelectedId: string | undefined) => {
      suggestionSaleTimeoutRef.current = setTimeout(() => {
        const interval = setInterval(() => {
          if (!lastSelectedId) return;

          const discountItem = stockList.find(
            (item) => item.id !== lastSelectedId && item.quantity > 0
          );
          if (discountItem) {
            alert(
              `${discountItem.name}은(는) 어떠세요? 지금 구매하시면 ${SALE.SUGGESTION.DISCOUNT * 100}% 추가 할인!`
            );
            updateStockPrice(lastSelectedId, () =>
              Math.round(discountItem.price * (1 - SALE.SUGGESTION.DISCOUNT))
            );
          }
        }, SALE.SUGGESTION.INTERVAL);

        return () => clearInterval(interval);
      }, Math.random() * SALE.SUGGESTION.DELAY);
    },
    [updateStockPrice]
  );

  useEffect(() => {
    startFlashSale(stockList);
    startSuggestionSale(stockList, lastSelectedId);

    return () => clearTimers();
  }, [lastSelectedId, startFlashSale, startSuggestionSale, stockList]);
};
