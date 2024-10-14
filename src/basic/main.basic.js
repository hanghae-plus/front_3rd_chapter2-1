import { updateCartInfos } from './utils/cart';
import { addToCart, changeCartItemQuantity, removeCartItem } from './utils/cartOperations';
import { setSuggestDiscount, setSurpriseDiscount } from './utils/discount';
import { products, renderProductOptions } from './utils/product';

let $productSelectDropdown, $addToCartBtn, $cartItemsDisplay, $cartTotalInfo, $productsStockInfo;
let lastAddedProduct,
  bonusPoints = 0;

const main = () => {
  renderCartUI();
  renderProductOptions();
  bonusPoints = updateCartInfos(bonusPoints);

  scheduleRandomDiscount();
  setEventListeners();
};

const renderCartUI = () => {
  const $root = document.getElementById('app');
  const $cartWrapper = document.createElement('div');
  const $cartContainer = document.createElement('div');
  const $cartTitle = document.createElement('h1');
  $cartItemsDisplay = document.createElement('div');
  $cartTotalInfo = document.createElement('div');
  $productSelectDropdown = document.createElement('select');
  $addToCartBtn = document.createElement('button');
  $productsStockInfo = document.createElement('div');

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

const handleAddToCart = () => {
  const selectedProductId = document.getElementById('product-select').value;
  const targetProduct = products.find((product) => {
    return product.id === selectedProductId;
  });

  if (targetProduct && targetProduct.quantity > 0) {
    const $targetCartItem = document.getElementById(targetProduct.id);

    addToCart($targetCartItem, targetProduct);
    bonusPoints = updateCartInfos(bonusPoints);
    lastAddedProduct = selectedProductId;
  }
};
const handle$CartItemsDisplay = (event) => {
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
    const currentItemQuantity = parseInt($itemElement.querySelector('span').textContent.split('x ')[1]);
    removeCartItem(targetProduct, $itemElement, currentItemQuantity);
  }

  bonusPoints = updateCartInfos(bonusPoints);
};
const setEventListeners = () => {
  $addToCartBtn.addEventListener('click', handleAddToCart);
  $cartItemsDisplay.addEventListener('click', handle$CartItemsDisplay);
};

const scheduleRandomDiscount = () => {
  setSurpriseDiscount();
  setSuggestDiscount(lastAddedProduct);
};

main();
