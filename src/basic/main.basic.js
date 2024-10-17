import BonusPoints from './components/BonusPoints.js';
import Cart from './components/Cart.js';
import CartProduct from './components/CartProduct.js';
import DiscountInfo from './components/DiscountInfo.js';
import ProductOption from './components/ProductOption.js';
import { productList } from './shared/product.js';

// shared/constants.js
const FLASH_SALE_INTERVAL = 30000;
const FLASH_SALE_CHANCE = 0.3;
const FLASH_SALE_DISCOUNT = 0.8;
const SUGGESTION_INTERVAL = 60000;
const SUGGESTION_DISCOUNT = 0.95;
const BULK_PURCHASE_THRESHOLD = 10;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;

// store/cartStore.js
let $productSelect, $addButton, $cartProduct, $cartTotal, $stockStatus;
let lastSelectedProductId;
let bonusPoints = 0;
let totalAmount = 0;
let productCount = 0;

// services/discountService.js
const getDiscount = (product, quantity) => {
  if (quantity >= BULK_PURCHASE_THRESHOLD) {
    return product.discountRate;
  }
  return 0;
};

const applyTuesdayDiscount = (totalAmount, discountRate) => {
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday) {
    const tuesdayDiscountAmount = totalAmount * TUESDAY_DISCOUNT_RATE;
    const currentDiscountAmount = totalAmount * discountRate;
    if (tuesdayDiscountAmount > currentDiscountAmount) {
      return TUESDAY_DISCOUNT_RATE;
    }
  }
  return discountRate;
};

const getDiscountRate = (productCount, subtotal, totalAmount) => {
  if (productCount >= 30) {
    const bulkDiscount = subtotal * BULK_DISCOUNT_RATE;
    const productDiscount = subtotal - totalAmount;
    if (bulkDiscount > productDiscount) {
      return BULK_DISCOUNT_RATE;
    }
  }
  return (subtotal - totalAmount) / subtotal;
};

// services/cartService.js
const calcCart = () => {
  totalAmount = 0;
  productCount = 0;
  const cartProduct = $cartProduct.children;
  let subTot = 0;
  for (let i = 0; i < cartProduct.length; i++) {
    const newProduct = cartProduct[i];
    const currentProduct = productList.find(
      (product) => product.id === newProduct.id,
    );

    if (!currentProduct) return;

    const quantity = parseInt(
      cartProduct[i].querySelector('span').textContent.split('x ')[1],
    );
    const productTotalPrice = currentProduct.price * quantity;
    const discount = getDiscount(currentProduct, quantity);

    productCount += quantity;
    subTot += productTotalPrice;
    totalAmount += productTotalPrice * (1 - discount);
  }
  let discountRate = getDiscountRate(productCount, subTot, totalAmount);
  discountRate = applyTuesdayDiscount(totalAmount, discountRate);

  updateCartTotal(discountRate);
  updateStockInfo();
  calculateBonusPoints();
  updateBonusPoints(bonusPoints);
};

const updateCartTotal = (discountRate) => {
  $cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    $cartTotal.innerHTML += DiscountInfo(discountRate);
  }
};

const calculateBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
};

const updateBonusPoints = (bonusPoints) => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    $cartTotal.innerHTML += BonusPoints(bonusPoints);
  }
};

// services/stockService.js
const updateStockInfo = () => {
  let infoMessage = '';
  productList.forEach((product) => {
    if (product.quantity < 5) {
      infoMessage +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatus.textContent = infoMessage;
};

// services/timerService.js
const handleTimerFlashSale = () => {
  setInterval(() => {
    const saleItem =
      productList[Math.floor(Math.random() * productList.length)];
    const canStartFlashSale =
      Math.random() < FLASH_SALE_CHANCE && saleItem.quantity > 0;
    if (canStartFlashSale) {
      saleItem.price = Math.round(saleItem.price * FLASH_SALE_DISCOUNT);
      alert(`번개세일! ${saleItem.name}이(가) 20% 할인 중입니다!`);
      updateProductOptions();
    }
  }, FLASH_SALE_INTERVAL);
};

const handleTimerSuggestion = () => {
  setInterval(() => {
    if (lastSelectedProductId) {
      const suggestedProduct = productList.find(
        (product) =>
          product.id !== lastSelectedProductId && product.quantity > 0,
      );
      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
        );
        suggestedProduct.price = Math.round(
          suggestedProduct.price * SUGGESTION_DISCOUNT,
        );
        updateProductOptions();
      }
    }
  }, SUGGESTION_INTERVAL);
};

// 메인

const main = () => {
  const $root = document.getElementById('app');
  $root.innerHTML = Cart();
  $cartProduct = document.getElementById('cart-items');
  $cartTotal = document.getElementById('cart-total');
  $productSelect = document.getElementById('product-select');
  $addButton = document.getElementById('add-to-cart');
  $stockStatus = document.getElementById('stock-status');

  updateProductOptions();
  calcCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

// productServices.js
const updateProductOptions = () => {
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    $productSelect.innerHTML += ProductOption(product);
  });
};

const findProductById = (id) =>
  productList.find((product) => product.id === id);

const updateProductQuantity = (button, cartProduct, product) => {
  const quantityChange = parseInt(button.dataset.change);
  const currentQuantity = getCurrentQuantity(cartProduct);
  const newQuantity = currentQuantity + quantityChange;
  const isValidQuantityChange =
    newQuantity > 0 && newQuantity <= product.quantity + currentQuantity;

  if (isValidQuantityChange) {
    updateCartProductQuantity(cartProduct, product, newQuantity);
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeCartProduct(cartProduct);
    product.quantity += currentQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

const updateCartProductQuantity = (cartProduct, product, newQuantity) => {
  const spanElement = cartProduct.querySelector('span');
  spanElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
};

const removeCartProduct = (cartProduct) => cartProduct.remove();

const removeProduct = (cartProduct, product) => {
  const removedQuantity = getCurrentQuantity(cartProduct);
  product.quantity += removedQuantity;
  removeCartProduct(cartProduct);
};

const getCurrentQuantity = (cartProduct) =>
  parseInt(cartProduct.querySelector('span').textContent.split('x ')[1]);

// cartServices.js
const handleClickAddToCart = () => {
  const selectedProductId = $productSelect.value;
  const productToAdd = findProductById(selectedProductId);

  if (!productToAdd || productToAdd.quantity <= 0) return;

  const existingCartProduct = document.getElementById(productToAdd.id);

  if (existingCartProduct) {
    updateExistingCartProduct(existingCartProduct, productToAdd);
  } else {
    addNewCartProduct(productToAdd);
  }

  calcCart();
  lastSelectedProductId = selectedProductId;
};

const updateExistingCartProduct = (cartProduct, product) => {
  const quantitySpan = cartProduct.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.quantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

const addNewCartProduct = (product) => {
  const newItem = CartProduct(product);
  $cartProduct.innerHTML += newItem;
  product.quantity--;
};

const handleClickCartAction = (event) => {
  const eventTarget = event.target;

  if (!isCartActionButton(eventTarget)) return;

  const productId = eventTarget.dataset.productId;
  const cartProduct = document.getElementById(productId);
  const product = findProductById(productId);

  if (eventTarget.classList.contains('quantity-change')) {
    updateProductQuantity(eventTarget, cartProduct, product);
  } else if (eventTarget.classList.contains('remove-item')) {
    removeProduct(cartProduct, product);
  }

  calcCart();
};

const isCartActionButton = (target) =>
  target.classList.contains('quantity-change') ||
  target.classList.contains('remove-item');

main();

$addButton.addEventListener('click', handleClickAddToCart);
$cartProduct.addEventListener('click', handleClickCartAction);
