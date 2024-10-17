import { productList } from '../shared/product.js';
import {
  FLASH_SALE_INTERVAL,
  FLASH_SALE_CHANCE,
  FLASH_SALE_DISCOUNT,
  SUGGESTION_INTERVAL,
  SUGGESTION_DISCOUNT,
} from '../shared/constants.js';
import { updateProductOptions } from './productService.js';
import productSelector from '../store/productSelector.js';

export const handleTimerFlashSale = () => {
  setInterval(() => {
    const saleItem =
      productList[Math.floor(Math.random() * productList.length)];
    const canStartFlashSale =
      Math.random() < FLASH_SALE_CHANCE && saleItem.quantity > 0;

    if (canStartFlashSale) {
      saleItem.price = Math.round(saleItem.price * FLASH_SALE_DISCOUNT);
      alert(`번개세일! ${saleItem.name}이(가) 20% 할인 중입니다!`);
      updateProductOptions();
    }
  }, FLASH_SALE_INTERVAL);
};

export const handleTimerSuggestion = () => {
  setInterval(() => {
    const lastSelectedProductId = productSelector.get();

    if (lastSelectedProductId) {
      const suggestedProduct = productList.find(
        (product) =>
          product.id !== lastSelectedProductId && product.quantity > 0,
      );
      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
        );
        suggestedProduct.price = Math.round(
          suggestedProduct.price * SUGGESTION_DISCOUNT,
        );
        updateProductOptions();
      }
    }
  }, SUGGESTION_INTERVAL);
};
