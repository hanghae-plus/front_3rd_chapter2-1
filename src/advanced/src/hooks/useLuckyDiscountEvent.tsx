import { useCallback, useEffect } from "react";

import { ProductOption } from "@/types";

const LUCKY_DISCOUNT_RATE = 0.2;
const INTERVAL_TIME = 30000;
const MAX_RANDOM_DELAY = 10000;
const RANDOM_THRESHOLD = 0.3;

function useLuckyDiscountEvent(
  targetList: ProductOption[],
  callback: (id: string, data: Partial<ProductOption>) => void,
) {
  const luckyDiscount = useCallback(() => {
    setInterval(() => {
      const luckyItem = { ...targetList[Math.floor(Math.random() * targetList.length)] };
      if (Math.random() < RANDOM_THRESHOLD && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - LUCKY_DISCOUNT_RATE));
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        callback(luckyItem.id, { price: luckyItem.price });
      }
    }, INTERVAL_TIME);
  }, [callback, targetList]);

  useEffect(() => {
    const timer = setTimeout(luckyDiscount, MAX_RANDOM_DELAY);
    return () => {
      clearTimeout(timer);
    };
  }, [luckyDiscount]);
}

export default useLuckyDiscountEvent;
