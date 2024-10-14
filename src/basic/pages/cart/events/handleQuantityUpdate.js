import { updateCartItemQuantity } from '../modules/updateCartItemQuantity.js';
import { calcCart } from '../modules/calcCart.js';

export function handleQuantityUpdate(event) {
  const target = event.target;
  const { itemId, change } = target.dataset;
  updateCartItemQuantity(itemId, parseInt(change));
  calcCart(); // 장바구니 총액 계산
}
