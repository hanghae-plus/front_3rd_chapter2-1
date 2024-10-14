import { cartTemplates } from './templates.js';
import { registerCartEvents } from './events/registerCartEvents.js';
import { cartItemStore, cartTotalPriceStore } from './store.js';
import { rerenderCartItems } from './rerenders/rerenderCartItems.js';
import { renderCartTotalAndPoints } from './rerenders/renderCartTotalAndPoints.js';

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);
  cartTotalPriceStore.subscribe(renderCartTotalAndPoints);

  return {
    element: cartTemplates(),
    events: registerCartEvents(),
  };
}

export default Cart;
