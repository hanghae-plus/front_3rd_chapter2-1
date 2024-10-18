import initView from '../util/view.js';
import addBtnEvent from './actions/addBtnEvent.js';
import calcCart from './actions/calcCart.js';
import addCartEvent from './actions/addCartEvent.js';

function main() {
  initView();
  calcCart();
  addBtnEvent();
  addCartEvent();
}

main();
