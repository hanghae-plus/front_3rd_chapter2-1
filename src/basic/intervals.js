import { SECOND } from './constants';
import ProductStore from './store';
import { updateSelectOptions } from './utils/ui';

const lighteningSaleInterval = () => {
  setTimeout(() => {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ProductStore.getAllProductList().length);
      const luckyItem = ProductStore.getProductByIndex(randomIndex);

      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
    }, 30 * SECOND);
  }, Math.random() * 10 * SECOND);
};

const lastItemSaleInterval = () => {
  setTimeout(() => {
    setInterval(() => {
      const lastSelItemId = ProductStore.getlastSelectItemId();

      if (lastSelItemId) {
        const suggest = ProductStore.getAllProductList().find((item) => {
          return item.id !== lastSelItemId && item.stock > 0;
        });

        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60 * SECOND);
  }, Math.random() * 20 * SECOND);
};

export const setupIntervals = () => {
  lighteningSaleInterval();
  lastItemSaleInterval();
};
