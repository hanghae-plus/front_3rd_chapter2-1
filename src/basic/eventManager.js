import { productList } from './global';
import updateSelectOptions from './updateSelectOptions';

export function setLuckySale() {
  setTimeout(function () {
    setInterval(function () {
      const randomIndex = Math.floor(Math.random() * productList.getProductList().length);
      const luckyItem = productList.getProductList()[randomIndex];
      const { name, price, quantity } = luckyItem.toObject();
      const isRandomTrue = Math.random() < 0.3 && quantity > 0;

      if (isRandomTrue) {
        luckyItem.setPrice(Math.round(price * 0.8));
        alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
}

export function setSuggestSale() {
  setTimeout(function () {
    setInterval(function () {
      const lastSelectedId = productList.getLastSelectedId();
      if (lastSelectedId) {
        let suggest = productList
          .toObject()
          .find((product) => product.id !== lastSelectedId && product.quantity > 0);

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          productList.getItem(suggest.id).setPrice(Math.round(suggest.price * 0.95));
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
