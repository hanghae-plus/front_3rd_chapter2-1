import { cartTemplates } from './templates.js';
import { events } from './events.js';
import { cartStore } from './store.js';

function Cart() {
  return {
    element: cartTemplates({ name }),
    events: events(),
  };
}

export default Cart;
