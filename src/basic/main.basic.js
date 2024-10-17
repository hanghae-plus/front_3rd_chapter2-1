import Cart from './components/Cart.js';
import {
  handleClickAddToCart,
  handleClickCartAction,
  calculateCart,
} from './services/cartService.js';
import { getDOMElements } from './shared/domSelectors.js';
import {
  handleTimerFlashSale,
  handleTimerSuggestion,
} from './services/timerSlice.js';
import { updateProductOptions } from './services/productService.js';

const main = () => {
  const { $root } = getDOMElements();
  $root.innerHTML = Cart();

  updateProductOptions();
  calculateCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

main();

const { $addButton, $cartProduct } = getDOMElements();
$addButton.addEventListener('click', handleClickAddToCart);
$cartProduct.addEventListener('click', handleClickCartAction);
