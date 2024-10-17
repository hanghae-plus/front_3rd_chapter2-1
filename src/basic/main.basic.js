import BonusPoints from './components/BonusPoints.js';
import Cart from './components/Cart.js';
import CartProduct from './components/CartProduct.js';
import DiscountInfo from './components/DiscountInfo.js';
import ProductOption from './components/ProductOption.js';
import { productList } from './shared/product.js';
import {
  FLASH_SALE_INTERVAL,
  FLASH_SALE_CHANCE,
  FLASH_SALE_DISCOUNT,
  SUGGESTION_INTERVAL,
  SUGGESTION_DISCOUNT,
  BULK_PURCHASE_THRESHOLD,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
  BONUS_POINT_RATE,
  LOW_STOCK_THRESHOLD,
  MAX_QUANTITY,
} from './shared/constants.js';
import { getDOMElements } from './shared/domSelectors.js';

// store/cartStore.js

let lastSelectedProductId;
let bonusPoints = 0;

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

const addNewCartProduct = (product) => {
  const newItem = CartProduct(product);
  $cartProduct.insertAdjacentHTML('beforeend', newItem);
  product.quantity--;
};

const handleClickCartAction = (event) => {
  const eventTarget = event.target;

  if (!isCartActionButton(eventTarget)) return;

  const { productId } = eventTarget.dataset;
  const cartProduct = document.getElementById(productId);
  const product = findProductById(productId);

  if (eventTarget.classList.contains('quantity-change')) {
    updateProductQuantity(eventTarget, cartProduct, product);
  } else if (eventTarget.classList.contains('remove-item')) {
    removeProduct(cartProduct, product);
  }

  calculateCart();
};

const isCartActionButton = (target) =>
  target.classList.contains('quantity-change') ||
  target.classList.contains('remove-item');

const handleClickAddToCart = () => {
  const { $productSelect } = getDOMElements();
  const selectedProductId = $productSelect.value;
  const productToAdd = findProductById(selectedProductId);

  if (!isProductAvailable(productToAdd)) return;

  const existingCartProduct = document.getElementById(productToAdd.id);

  existingCartProduct
    ? updateExistingCartProduct(existingCartProduct, productToAdd)
    : addNewCartProduct(productToAdd);

  calculateCart();
  lastSelectedProductId = selectedProductId;
};

const calculateCartTotals = (cartProducts) => {
  return cartProducts.reduce(
    (totals, cartProduct) => {
      const product = productList.find((p) => p.id === cartProduct.id);
      if (!product) return totals;

      const quantity = getProductQuantity(cartProduct);
      const productTotal = product.price * quantity;
      const discount = getDiscount(product, quantity);

      totals.productCount += quantity;
      totals.subtotal += productTotal;
      totals.totalAmount += productTotal * (1 - discount);

      return totals;
    },
    { productCount: 0, subtotal: 0, totalAmount: 0 },
  );
};

const getProductQuantity = (cartProduct) => {
  return parseInt(cartProduct.querySelector('span').textContent.split('x ')[1]);
};

const calculateFinalDiscount = (productCount, subtotal, totalAmount) => {
  let discountRate = getDiscountRate(productCount, subtotal, totalAmount);
  return applyTuesdayDiscount(totalAmount, discountRate);
};

const updateCartDisplay = (totalAmount, discountRate) => {
  const { $cartTotal } = getDOMElements();
  $cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    $cartTotal.innerHTML += DiscountInfo(discountRate);
  }
};

const calculateAndUpdateBonusPoints = (totalAmount) => {
  const newBonusPoints = Math.floor(totalAmount / BONUS_POINT_RATE);
  bonusPoints += newBonusPoints;
  updateBonusPointsDisplay(bonusPoints);
};

const updateBonusPointsDisplay = (bonusPoints) => {
  const { $cartTotal } = getDOMElements();
  const pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    $cartTotal.innerHTML += BonusPoints(bonusPoints);
  } else {
    pointsTag.textContent = `보너스 포인트: ${bonusPoints}점`;
  }
};

const calculateCart = () => {
  const { $cartProduct } = getDOMElements();
  const cartProducts = Object.values($cartProduct.children);
  const { productCount, subtotal, totalAmount } =
    calculateCartTotals(cartProducts);
  const discountRate = calculateFinalDiscount(
    productCount,
    subtotal,
    totalAmount,
  );

  updateCartDisplay(totalAmount, discountRate);
  updateStockInfo();
  calculateAndUpdateBonusPoints(totalAmount);
};

const updateStockInfo = () => {
  const { $stockStatus } = getDOMElements();
  const lowStockProducts = productList
    .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
    .map((product) => formatStockMessage(product))
    .join('\n');

  $stockStatus.textContent = lowStockProducts;
};

const formatStockMessage = (product) => {
  const stockStatus =
    product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : '품절';

  return `${product.name}: ${stockStatus}`;
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
  const { $root } = getDOMElements();
  $root.innerHTML = Cart();

  updateProductOptions();
  calculateCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

// productServices.js
const updateProductOptions = () => {
  const { $productSelect } = getDOMElements();
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    $productSelect.innerHTML += ProductOption(product);
  });
};

const findProductById = (id) =>
  productList.find((product) => product.id === id);

const updateProductQuantity = (button, cartProduct, product) => {
  const quantityChange = parseInt(button.dataset.change);
  const currentQuantity = getCurrentQuantity(cartProduct.querySelector('span'));
  const newQuantity = currentQuantity + quantityChange;

  if (isValidQuantityChange(newQuantity, product.quantity + currentQuantity)) {
    updateCartProductQuantity(
      cartProduct.querySelector('span'),
      product,
      newQuantity,
    );
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeProduct(cartProduct, product);
  } else {
    alert('재고가 부족합니다.');
  }
};

const isValidQuantityChange = (newQuantity, availableQuantity) => {
  return (
    newQuantity > 0 && newQuantity <= Math.min(availableQuantity, MAX_QUANTITY)
  );
};

const updateCartProductQuantity = (quantitySpan, product, newQuantity) => {
  quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
};

const removeCartProduct = (cartProduct) => cartProduct.remove();

const removeProduct = (cartProduct, product) => {
  const removedQuantity = getCurrentQuantity(cartProduct);
  product.quantity += removedQuantity;
  removeCartProduct(cartProduct);
};

const isProductAvailable = (product) => {
  if (!product || product.quantity <= 0) {
    alert('선택한 상품은 현재 구매할 수 없습니다.');
    return false;
  }
  return true;
};

const updateExistingCartProduct = (cartProduct, product) => {
  const quantitySpan = cartProduct.querySelector('span');
  const currentQuantity = getCurrentQuantity(quantitySpan);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= Math.min(product.quantity, MAX_QUANTITY)) {
    updateCartProductQuantity(quantitySpan, product, newQuantity);
    product.quantity--;
  } else {
    alert('더 이상 수량을 늘릴 수 없습니다.');
  }
};

const getCurrentQuantity = (quantitySpan) => {
  return parseInt(quantitySpan.textContent.split('x ')[1]);
};

main();

const { $addButton, $cartProduct } = getDOMElements();
$addButton.addEventListener('click', handleClickAddToCart);
$cartProduct.addEventListener('click', handleClickCartAction);
