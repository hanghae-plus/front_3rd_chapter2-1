import CartProduct from '../components/CartProduct.js';
import BonusPoints from '../components/BonusPoints.js';
import DiscountInfo from '../components/DiscountInfo.js';
import { productList } from '../shared/product.js';
import { getDOMElements } from '../shared/domSelectors.js';
import {
  getDiscount,
  applyTuesdayDiscount,
  getDiscountRate,
} from './discountService.js';
import { BONUS_POINT_RATE, LOW_STOCK_THRESHOLD } from '../shared/constants.js';
import {
  findProductById,
  isProductAvailable,
  updateProductQuantity,
  removeProduct,
  updateExistingCartProduct,
} from './productService.js';
import productSelector from '../store/productSelector.js';

let bonusPoints = 0;

const addNewCartProduct = (product) => {
  const { $cartProduct } = getDOMElements();
  const newItem = CartProduct(product);
  $cartProduct.insertAdjacentHTML('beforeend', newItem);
  product.quantity--;
};

export const handleClickCartAction = (event) => {
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

export const handleClickAddToCart = () => {
  const { $productSelect } = getDOMElements();
  const selectedProductId = $productSelect.value;
  const productToAdd = findProductById(selectedProductId);

  if (!isProductAvailable(productToAdd)) return;

  const existingCartProduct = document.getElementById(productToAdd.id);

  existingCartProduct
    ? updateExistingCartProduct(existingCartProduct, productToAdd)
    : addNewCartProduct(productToAdd);

  calculateCart();
  productSelector.set(selectedProductId);
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

export const calculateCart = () => {
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
