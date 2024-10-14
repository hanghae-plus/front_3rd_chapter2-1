import { cartItemStore } from '../store.js';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';

const createStockStatusText = (item) =>
  `${item.name}: ${item.quantity > 0 ? '재고 부족' + ` (${item.quantity}개 남음)` : '품절'}\n`;

export function rerenderStockStatus() {
  let updateContent = '';
  let currentContent = '';

  const { cartItems } = cartItemStore.getState();
  const $stockInfoContainer = document.getElementById('stock-status');

  const notQuantityList = DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0);

  if (notQuantityList.length > 0) {
    notQuantityList.forEach((item) => {
      currentContent = createStockStatusText(item);
    });
  }

  cartItems.forEach((cartItem) => {
    if (cartItem.quantity <= 5) {
      updateContent = createStockStatusText(cartItem);
    }
  });

  $stockInfoContainer.textContent = currentContent + updateContent;
}
