import { updateCartItemQuantity } from '../modules/updateCartItemQuantity.js';

export function handleQuantityUpdate(event) {
  const target = event.target;
  const { itemId, change } = target.dataset;
  updateCartItemQuantity(itemId, parseInt(change));
}
