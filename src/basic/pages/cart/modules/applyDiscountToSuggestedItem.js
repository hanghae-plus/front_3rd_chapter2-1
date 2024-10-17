import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';
import { selectedProductItemState } from '../state.js';

export function applyDiscountToSuggestedItem() {
  const { selectedProductItem } = selectedProductItemState.getState();

  if (!selectedProductItem) {
    return;
  }

  const suggest = DEFAULT_PRODUCT_LIST.find(
    (item) => item.id !== selectedProductItem && item.quantity > 0,
  );
  if (suggest) {
    suggest.price = Math.round(suggest.val * 0.95); // 5% 할인 적용
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  }
}

export function initSuggestedDiscount() {
  const initialDelay = Math.random() * 20000; // 20초 내외의 초기 딜레이
  const intervalTime = 60000; // 매 60초마다 실행

  setTimeout(() => {
    setInterval(applyDiscountToSuggestedItem, intervalTime);
  }, initialDelay);
}
