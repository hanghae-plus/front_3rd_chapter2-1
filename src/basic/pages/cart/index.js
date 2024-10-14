import { cartTemplates } from './templates.js';
import { registerCartEvents } from './events/registerCartEvents.js';
import { cartItemStore, cartPointStore, cartTotalPriceStore } from './store.js';
import { rerenderCartItems } from './modules/rerenderCartItems.js';
import { rerenderCartTotalPrice } from './modules/rerenderCartTotalPrice.js';

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);
  cartTotalPriceStore.subscribe(rerenderCartTotalPrice);

  return {
    element: cartTemplates(),
    events: registerCartEvents(),
  };
}

export default Cart;
