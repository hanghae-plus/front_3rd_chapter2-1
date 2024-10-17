import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';
import { selectedProductItemState } from '../state.js';

const SUGGESTED_DISCOUNT_PERCENTAGE = 0.95;

const INITIAL_DELAY_MS = Math.random() * 20000;
const INTERVAL_TIME_MS = 60000;

function applyDiscountToSuggestedItem() {
  const { selectedProductItem } = selectedProductItemState.getState();

  if (!selectedProductItem) {
    return;
  }

  const suggest = DEFAULT_PRODUCT_LIST.find(
    (item) => item.id !== selectedProductItem && item.quantity > 0,
  );
  if (suggest) {
    suggest.price = Math.round(suggest.price * SUGGESTED_DISCOUNT_PERCENTAGE);
    alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  }
}

export function initSuggestedDiscount() {
  setTimeout(() => {
    setInterval(applyDiscountToSuggestedItem, INTERVAL_TIME_MS);
  }, INITIAL_DELAY_MS);
}
