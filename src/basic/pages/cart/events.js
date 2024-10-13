import { addEvent } from '../../utils/eventUtils.js';
import { handleAddToCart } from './events/handleAddToCart.js';

export function events() {
  function test3() {
    addEvent('click', '#add-to-cart', handleAddToCart);
  }

  return {
    test3,
  };
}
