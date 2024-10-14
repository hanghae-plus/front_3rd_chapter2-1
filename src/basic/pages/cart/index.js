import { cartTemplates } from './templates.js';
import { registerCartEvents } from './events/registerCartEvents.js';
import { cartItemStore, cartTotalPriceStore, selectedItemStore } from './store.js';
import { rerenderCartItems } from './rerenders/rerenderCartItems.js';
import { renderCartTotalAndPoints } from './rerenders/renderCartTotalAndPoints.js';
import { startLuckySale } from './modules/applyLuckySale.js';
import { initSuggestedDiscount } from './modules/applyDiscountToSuggestedItem.js';

function Cart() {
  cartItemStore.subscribe(rerenderCartItems);
  cartTotalPriceStore.subscribe(renderCartTotalAndPoints);
  selectedItemStore.subscribe(initSuggestedDiscount);

  startLuckySale();

  return {
    element: cartTemplates(),
    events: registerCartEvents(),
  };
}

export default Cart;
