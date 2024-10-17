import CartPage from './views/CartPage.js';
import {
  handleClickAddToCart,
  handleClickCartAction,
  calculateCart,
} from './services/cartService.js';
import { getDOMElements } from './shared/domSelectors.js';
import {
  handleTimerFlashSale,
  handleTimerSuggestion,
} from './services/timerService.js';
import { updateProductOptions } from './services/productService.js';

const main = () => {
  const { $root } = getDOMElements();
  $root.innerHTML = CartPage();

  updateProductOptions();
  calculateCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

main();

const { $addToCartButton, $cartProduct } = getDOMElements();
$addToCartButton.addEventListener('click', handleClickAddToCart);
$cartProduct.addEventListener('click', handleClickCartAction);
