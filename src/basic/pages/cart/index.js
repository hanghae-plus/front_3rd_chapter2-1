import { cartTemplates } from './templates.js';
import { registerCartEvents } from './events/registerCartEvents.js';
import { cartItemStore } from './store.js';
import { rerenderCartItems } from './modules/rerenderCartItems.js';

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);

  return {
    element: cartTemplates(),
    events: registerCartEvents(),
  };
}

export default Cart;
