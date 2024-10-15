import { products } from '../data/products';
import {
  SURPRISE_DISCOUNT_PROBABILITY,
  SURPRISE_DISCOUNT_RATE,
  SURPRISE_TIME_INTERVAL,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_TIME_INTERVAL,
} from '../constants';
import { useEffect } from 'react';

const useEvents = () => {
  const setSurpriseDiscount = () => {
    setTimeout(() => {
      setInterval(() => {
        const luckyItem = products[Math.floor(Math.random() * products.length)];
        if (Math.random() < SURPRISE_DISCOUNT_PROBABILITY && luckyItem.quantity > 0) {
          luckyItem.price = Math.round(luckyItem.price * SURPRISE_DISCOUNT_RATE);
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          //   renderProductOptions();
        }
      }, SURPRISE_TIME_INTERVAL);
    }, Math.random() * 10000);
  };
  const setSuggestDiscount = (lastAddedProduct) => {
    setTimeout(() => {
      setInterval(() => {
        if (lastAddedProduct) {
          const suggest = products.find((product) => {
            return product.id !== lastAddedProduct && product.quantity > 0;
          });
          if (suggest) {
            alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
            // renderProductOptions();
          }
        }
      }, SUGGEST_TIME_INTERVAL);
    }, Math.random() * 20000);
  };

  useEffect(() => {
    setSurpriseDiscount();
    setSuggestDiscount(null);
  });
};

export default useEvents;
