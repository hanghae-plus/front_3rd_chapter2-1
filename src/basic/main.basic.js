import BonusPoints from './components/BonusPoints.js';
import Cart from './components/Cart.js';
import CartItem from './components/CartItem.js';
import DiscountInfo from './components/DiscountInfo.js';
import ItemOption from './components/ItemOption.js';
import { productList } from './shared/product.js';

let $productSelect, $addButton, $cartItems, $cartTotal, $stockStatus;
let lastSelectedProductId,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

const handleTimerFlashSale = () => {
  const FLASH_SALE_INTERVAL = 30000;
  const FLASH_SALE_CHANCE = 0.3;
  const FLASH_SALE_DISCOUNT = 0.8;

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
  const SUGGESTION_INTERVAL = 60000;
  const SUGGESTION_DISCOUNT = 0.95;

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

const main = () => {
  const $root = document.getElementById('app');
  $root.innerHTML = Cart();
  $cartItems = document.getElementById('cart-items');
  $cartTotal = document.getElementById('cart-total');
  $productSelect = document.getElementById('product-select');
  $addButton = document.getElementById('add-to-cart');
  $stockStatus = document.getElementById('stock-status');

  updateProductOptions();
  calcCart();

  setTimeout(handleTimerFlashSale, Math.random() * 10000);
  setTimeout(handleTimerSuggestion, Math.random() * 20000);
};

const updateProductOptions = () => {
  $productSelect.innerHTML = '';
  productList.forEach((product) => {
    $productSelect.innerHTML += ItemOption(product);
  });
};

const calcCart = () => {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = $cartItems.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const currentProduct = productList.find(
      (product) => product.id === cartItem.id,
    );

    if (!currentProduct) return;

    const quantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );
    const productTotalPrice = currentProduct.price * quantity;
    const discount = getDiscount(currentProduct, quantity);

    itemCount += quantity;
    subTot += productTotalPrice;
    totalAmount += productTotalPrice * (1 - discount);
  }
  let discountRate = getDiscountRate(itemCount, subTot, totalAmount);
  discountRate = applyTuesdayDiscount(totalAmount, discountRate);

  updateCartTotal(discountRate);
  updateStockInfo();
  calculateBonusPoints();
  updateBonusPoints(bonusPoints);
};

const getDiscount = (product, quantity) => {
  if (quantity >= 10) {
    switch (product.id) {
      case 'p1':
        return 0.1;
      case 'p2':
        return 0.15;
      case 'p3':
        return 0.2;
      case 'p4':
        return 0.05;
      case 'p5':
        return 0.25;
      default:
        return 0;
    }
  }
  return 0;
};

const applyTuesdayDiscount = (totalAmount, discountRate) => {
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    return (discountRate = Math.max(discountRate, 0.1));
  }
  return discountRate;
};

const getDiscountRate = (itemCount, subtotal, totalAmount) => {
  if (itemCount >= 30) {
    const bulkDiscount = subtotal * 0.25;
    const itemDiscount = subtotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * (1 - 0.25);
      return 0.25;
    }
    return (subtotal - totalAmount) / subtotal;
  }
  return (subtotal - totalAmount) / subtotal;
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

main();

const handleClickAddToCart = () => {
  const selectedProductId = $productSelect.value;
  const itemToAdd = findProductById(selectedProductId);

  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  const existingCartItem = document.getElementById(itemToAdd.id);

  if (existingCartItem) {
    updateExistingCartItem(existingCartItem, itemToAdd);
  } else {
    addNewCartItem(itemToAdd);
  }

  calcCart();
  lastSelectedProductId = selectedProductId;
};

const findProductById = (id) => productList.find((p) => p.id === id);

const updateExistingCartItem = (cartItem, product) => {
  const quantitySpan = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.quantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

const addNewCartItem = (product) => {
  const newItem = CartItem(product);
  $cartItems.innerHTML += newItem;
  product.quantity--;
};

const handleClickCartAction = (event) => {
  const eventTarget = event.target;

  if (!isCartActionButton(eventTarget)) return;

  const productId = eventTarget.dataset.productId;
  const cartItem = document.getElementById(productId);
  const product = findProductById(productId);

  if (eventTarget.classList.contains('quantity-change')) {
    updateItemQuantity(eventTarget, cartItem, product);
  } else if (eventTarget.classList.contains('remove-item')) {
    removeItem(cartItem, product);
  }

  calcCart();
};

const isCartActionButton = (target) =>
  target.classList.contains('quantity-change') ||
  target.classList.contains('remove-item');

const updateItemQuantity = (button, cartItem, product) => {
  const quantityChange = parseInt(button.dataset.change);
  const currentQuantity = getCurrentQuantity(cartItem);
  const newQuantity = currentQuantity + quantityChange;
  const isValidQuantityChange =
    newQuantity > 0 && newQuantity <= product.quantity + currentQuantity;

  if (isValidQuantityChange) {
    updateCartItemQuantity(cartItem, product, newQuantity);
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeCartItem(cartItem);
    product.quantity += currentQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

const getCurrentQuantity = (cartItem) =>
  parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);

const updateCartItemQuantity = (cartItem, product, newQuantity) => {
  const spanElement = cartItem.querySelector('span');
  spanElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
};

const removeCartItem = (cartItem) => cartItem.remove();

const removeItem = (cartItem, product) => {
  const removedQuantity = getCurrentQuantity(cartItem);
  product.quantity += removedQuantity;
  removeCartItem(cartItem);
};

$addButton.addEventListener('click', handleClickAddToCart);

$cartItems.addEventListener('click', handleClickCartAction);
