import { useEffect } from "react";

import { productOptions } from "../constants/product";
import { ProductOption } from "../types/cart";

function useLuckyDiscountEvent(callback: (data: ProductOption) => void) {
  useEffect(() => {
    const luckyDiscount = () => {
      const interval = () => {
        setInterval(() => {
          const luckyItem = { ...productOptions[Math.floor(Math.random() * productOptions.length)] };
          if (Math.random() < 0.3 && luckyItem.q > 0) {
            luckyItem.val = Math.round(luckyItem.val * 0.8);
            alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
            callback(luckyItem);
          }
        }, 30000);
      };
      setTimeout(interval, Math.random() * 10000);
    };

    luckyDiscount();
  }, [callback]);

  return;
}

export default useLuckyDiscountEvent;
