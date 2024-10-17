import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts.js';
import { cartItemState } from '../state.js';

const createStockStatusText = (item) =>
  `${item.name}: ${item.quantity > 0 ? '재고 부족' + ` (${item.quantity}개 남음)` : '품절'}\n`;

export function rerenderStockStatus() {
  let stockStatusText = '';

  const { cartItems } = cartItemState.getState();
  const $stockInfoContainer = document.getElementById('stock-status');

  const soldOutItems = DEFAULT_PRODUCT_LIST.filter((product) => product.quantity === 0);

  if (soldOutItems.length > 0) {
    soldOutItems.forEach((item) => {
      stockStatusText += createStockStatusText(item);
    });
  }

  cartItems.forEach((cartItem) => {
    if (cartItem.quantity <= 5) {
      stockStatusText += createStockStatusText(cartItem);
    }
  });

  $stockInfoContainer.textContent = stockStatusText;
}
