import { addEvent } from '../../../utils/eventUtils.js';
import { handleAddToCart } from './handleAddToCart.js';
import { handleQuantityUpdate } from './handleQuantityUpdate.js';
import { handleRemoveCartItem } from './handleRemoveCartItem.js';

export function registerCartEvents() {
  function addAddToCartEvent() {
    addEvent('click', '#add-to-cart', handleAddToCart);
  }

  function addQuantityUpdateEvent() {
    addEvent('click', '.quantity-change', handleQuantityUpdate);
  }

  function addRemoveCartItemEvent() {
    addEvent('click', '.remove-item', handleRemoveCartItem);
  }

  return {
    addQuantityUpdateEvent,
    addRemoveCartItemEvent,
    addAddToCartEvent,
  };
}
