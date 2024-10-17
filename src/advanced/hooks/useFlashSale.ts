// hooks/useFlashSale.ts
import { useEffect, useState } from 'react';
import { useCart } from './useCart';

export const useFlashSale = () => {
  const { products, updateProductPrice } = useCart();
  const [flashSaleItem, setFlashSaleItem] = useState<string | null>(null);

  useEffect(() => {
    const triggerFlashSale = () => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        const discountedPrice = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductPrice(luckyItem.id, discountedPrice);
        setFlashSaleItem(luckyItem.id);
      }
    };

    const interval = setInterval(triggerFlashSale, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, [products, updateProductPrice]);

  return flashSaleItem;
};
