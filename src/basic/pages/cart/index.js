import { cartTemplates } from './templates.js';
import { registerCartEvents } from './events/registerCartEvents.js';
import { cartItemState, cartTotalPriceState, selectedProductItemState } from './state.js';
import { rerenderCartItems } from './rerenders/rerenderCartItems.js';
import { renderCartTotalAndPoints } from './rerenders/renderCartTotalAndPoints.js';
import { startLuckySale } from './modules/applyLuckySale.js';
import { initSuggestedDiscount } from './modules/applyDiscountToSuggestedItem.js';

function Cart() {
  cartItemState.subscribe(rerenderCartItems);
  cartTotalPriceState.subscribe(renderCartTotalAndPoints);
  selectedProductItemState.subscribe(initSuggestedDiscount);

  startLuckySale();

  return {
    element: cartTemplates(),
    events: registerCartEvents(),
  };
}

export default Cart;
