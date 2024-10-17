import { useEffect, useState } from 'react';
import { Events } from '../types/Sales';
import { useCart } from './useCart';

export const useSales = () => {
  const { products, updateProductPrice } = useCart();
  const [flashSaleItem, setFlashSaleItem] = useState<string | null>(null);
  const [recommendedSaleItem, setRecommendedSaleItem] = useState<string | null>(
    null
  );
  const [events, setEvents] = useState<Events | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/src/advanced/events/events.json');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!events) return;

    const triggerSale = (saleType: 'flashSale' | 'recommendedSale') => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      const saleEvent = events[saleType];

      if (Math.random() < saleEvent.probability && luckyItem.stock > 0) {
        const discountedPrice = Math.round(
          luckyItem.price * (1 - saleEvent.rate)
        );
        const saleMessage =
          saleType === 'flashSale' ? '번개세일' : '추천상품 할인';
        alert(
          `${saleMessage}! ${luckyItem.name}이(가) ${saleEvent.rate * 100}% 할인 중입니다!`
        );
        updateProductPrice(luckyItem.id, discountedPrice);

        if (saleType === 'flashSale') {
          setFlashSaleItem(luckyItem.id);
        } else {
          setRecommendedSaleItem(luckyItem.id);
        }
      }
    };

    const flashSaleInterval = setInterval(
      () => triggerSale('flashSale'),
      events.flashSale.checkInterval
    );
    const recommendedSaleInterval = setInterval(
      () => triggerSale('recommendedSale'),
      events.recommendedSale.checkInterval
    );

    return () => {
      clearInterval(flashSaleInterval);
      clearInterval(recommendedSaleInterval);
    };
  }, [events, products, updateProductPrice]);

  return { flashSaleItem, recommendedSaleItem };
};
