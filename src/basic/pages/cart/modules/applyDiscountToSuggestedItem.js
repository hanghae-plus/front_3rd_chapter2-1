import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';
import { selectedProductItemState } from '../state.js';

function applyDiscountToSuggestedItem() {
  const { selectedProductItem } = selectedProductItemState.getState();

  if (!selectedProductItem) {
    return;
  }

  const suggest = DEFAULT_PRODUCT_LIST.find(
    (item) => item.id !== selectedProductItem && item.quantity > 0,
  );
  if (suggest) {
    suggest.price = Math.round(suggest.price * 0.95);
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  }
}

export function initSuggestedDiscount() {
  const initialDelay = Math.random() * 20000;
  const intervalTime = 60000;

  setTimeout(() => {
    setInterval(applyDiscountToSuggestedItem, intervalTime);
  }, initialDelay);
}
