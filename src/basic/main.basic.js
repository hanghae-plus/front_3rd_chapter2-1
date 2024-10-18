import { products } from './data/products';
import { updateCartTotalText } from './services/cart';
import { addToCart, changeCartItemQuantity, removeCartItem } from './services/cartOperations';
import { setSuggestDiscount, setSurpriseDiscount } from './services/discount';
import { getTargetItemElementQuantity } from './utils/cart';
import { renderProductOptions } from './views/product';

let $addToCartBtn, $cartItemsDisplay;
let lastAddedProductId,
  bonusPoints = 0;

const main = () => {
  renderCartUI();
  renderProductOptions();
  updateCartTotalText(bonusPoints);

  scheduleRandomDiscount();
  setEventListeners();
};

// 전역변수와 관련이 있는 함수들은 main.js에서 관리
const renderCartUI = () => {
  const $root = document.getElementById('app');
  const $cartWrapper = document.createElement('div');
  const $cartContainer = document.createElement('div');
  const $cartTitle = document.createElement('h1');
  const $cartTotalInfo = document.createElement('div');
  const $productSelectDropdown = document.createElement('select');
  const $productsStockInfo = document.createElement('div');
  $cartItemsDisplay = document.createElement('div');
  $addToCartBtn = document.createElement('button');

  $cartItemsDisplay.id = 'cart-items';
  $cartTotalInfo.id = 'cart-total';
  $productSelectDropdown.id = 'product-select';
  $addToCartBtn.id = 'add-to-cart';
  $productsStockInfo.id = 'stock-status';

  $cartWrapper.className = 'bg-gray-100 p-8';
  $cartContainer.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $cartTitle.className = 'text-2xl font-bold mb-4';
  $cartTotalInfo.className = 'text-xl font-bold my-4';
  $productSelectDropdown.className = 'border rounded p-2 mr-2';
  $addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $productsStockInfo.className = 'text-sm text-gray-500 mt-2';
  $cartTitle.textContent = '장바구니';
  $addToCartBtn.textContent = '추가';

  $cartContainer.appendChild($cartTitle);
  $cartContainer.appendChild($cartItemsDisplay);
  $cartContainer.appendChild($cartTotalInfo);
  $cartContainer.appendChild($productSelectDropdown);
  $cartContainer.appendChild($addToCartBtn);
  $cartContainer.appendChild($productsStockInfo);

  $cartWrapper.appendChild($cartContainer);
  $root.appendChild($cartWrapper);
};
const scheduleRandomDiscount = () => {
  setSurpriseDiscount();
  setSuggestDiscount(lastAddedProductId);
};
const setEventListeners = () => {
  $addToCartBtn.addEventListener('click', handleAddToCart);
  $cartItemsDisplay.addEventListener('click', handleCartItemsDisplay);
};

const handleAddToCart = () => {
  const selectedProductId = document.getElementById('product-select').value;
  const targetProduct = products.find((product) => {
    return product.id === selectedProductId;
  });

  if (targetProduct && targetProduct.quantity > 0) {
    const $targetCartItem = document.getElementById(targetProduct.id);

    addToCart($targetCartItem, targetProduct);
    bonusPoints = updateCartTotalText(bonusPoints);
    lastAddedProductId = selectedProductId;
  }
};
const handleCartItemsDisplay = (event) => {
  const clickedElement = event.target;
  const isRelatedQuantityChange =
    clickedElement.classList.contains('quantity-change') || clickedElement.classList.contains('remove-item');

  if (!isRelatedQuantityChange) return;

  const productId = clickedElement.dataset.productId;
  const $itemElement = document.getElementById(productId);
  const targetProduct = products.find((product) => {
    return product.id === productId;
  });

  if (clickedElement.classList.contains('quantity-change')) {
    changeCartItemQuantity(clickedElement, $itemElement, targetProduct);
  } else if (clickedElement.classList.contains('remove-item')) {
    const currentItemQuantity = getTargetItemElementQuantity($itemElement);
    removeCartItem(targetProduct, $itemElement, currentItemQuantity);
  }

  bonusPoints = updateCartTotalText(bonusPoints);
};

main();
