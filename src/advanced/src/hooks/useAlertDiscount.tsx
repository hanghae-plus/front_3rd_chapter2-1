import {
  SURPRISE_DISCOUNT_PROBABILITY,
  SURPRISE_DISCOUNT_RATE,
  SURPRISE_TIME_INTERVAL,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_TIME_INTERVAL,
} from '../constants';
import { useEffect, useRef } from 'react';
import { useCartStore, useProductStore } from '../stores';

const useEvents = () => {
  const storeLastAddedProduct = useProductStore((state) => state.lastAddedProduct);
  const storeProducts = useProductStore((state) => state.products);
  const updateProductPrice = useProductStore((state) => state.updateProductPrice);
  const updateCartPrice = useCartStore((state) => state.updateCartPrice);

  const surpriseTimeoutRef = useRef<number | null>(null);
  const suggestTimeoutRef = useRef<number | null>(null);
  const surpriseIntervalRef = useRef<number | null>(null);
  const suggestIntervalRef = useRef<number | null>(null);

  const setSurpriseDiscount = () => {
    surpriseTimeoutRef.current = setTimeout(() => {
      surpriseIntervalRef.current = setInterval(() => {
        const luckyItem = storeProducts[Math.floor(Math.random() * storeProducts.length)];
        if (Math.random() < SURPRISE_DISCOUNT_PROBABILITY && luckyItem.quantity > 0) {
          luckyItem.price = Math.round(luckyItem.price * SURPRISE_DISCOUNT_RATE);
          updateProductPrice(luckyItem, luckyItem.price);
          updateCartPrice(luckyItem, luckyItem.price);
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, SURPRISE_TIME_INTERVAL);
    }, Math.random() * 10000);
  };
  const setSuggestDiscount = () => {
    suggestTimeoutRef.current = setTimeout(() => {
      suggestIntervalRef.current = setInterval(() => {
        if (storeLastAddedProduct) {
          const suggest = storeProducts.find((product) => {
            return product.id !== storeLastAddedProduct.id && product.quantity > 0;
          });
          if (suggest) {
            suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
            updateProductPrice(suggest, suggest.price);
            updateCartPrice(suggest, suggest.price);
            alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, SUGGEST_TIME_INTERVAL);
    }, Math.random() * 20000);
  };

  useEffect(() => {
    setSurpriseDiscount();
    setSuggestDiscount();

    return () => {
      if (surpriseTimeoutRef.current) clearTimeout(surpriseTimeoutRef.current);
      if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);
      if (surpriseIntervalRef.current) clearInterval(surpriseIntervalRef.current);
      if (suggestIntervalRef.current) clearInterval(suggestIntervalRef.current);
    };
  });
};

export default useEvents;
