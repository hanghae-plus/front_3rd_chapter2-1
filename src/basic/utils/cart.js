import {
  calculateDayDiscount,
  calculateDiscountedPrice,
  calculateTotalProductsBulkDiscount,
  getProductBulkDiscountRate,
} from './discount';
import { products, renderProductsStockInfo } from './product';

export const getTargetItemElementQuantity = ($targetItemElement) => {
  return parseInt($targetItemElement.querySelector('span').textContent.split('x ')[1]);
};

export const updateCartInfos = (bonusPoints) => {
  const { totalItems, totalPrice, discountedTotalPrice } = calculateCartTotals();

  const updatedTotalPriceAndDiscountRate = calculateTotalProductsBulkDiscount(
    totalItems,
    totalPrice,
    discountedTotalPrice,
  );
  const { updatedTotalPrice, discountRate } = calculateDayDiscount(updatedTotalPriceAndDiscountRate);

  updateCartTotalInfo(updatedTotalPrice, discountRate);
  bonusPoints = updateBonusPoints(bonusPoints, updatedTotalPrice);
  renderProductsStockInfo();

  return bonusPoints;
};
export const updateCartItemInfo = (targetProduct, newItemQuantity, targetCartItem) => {
  const newCartItemInfo = `${targetProduct.name} - ${targetProduct.price}원 x ${newItemQuantity}`;
  targetCartItem.querySelector('span').textContent = newCartItemInfo;
};
const updateCartTotalInfo = (discountedTotalPrice, discountRate) => {
  const $cartTotalInfo = document.getElementById('cart-total');

  $cartTotalInfo.textContent = `총액: ${Math.round(discountedTotalPrice)}원`;
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    $cartTotalInfo.appendChild(span);
  }
};

const calculateCartTotals = () => {
  let totalItems = 0;
  let totalPrice = 0;
  let discountedTotalPrice = 0;

  const cartItems = document.getElementById('cart-items').children;

  for (let $cartItem of cartItems) {
    const currentProduct = products.find((product) => product.id === $cartItem.id);
    const quantity = getTargetItemElementQuantity($cartItem);
    const productTotalPrice = currentProduct.price * quantity;

    totalItems += quantity;
    totalPrice += productTotalPrice;

    const productBulkDiscountRate = getProductBulkDiscountRate(currentProduct.id, quantity);
    discountedTotalPrice += calculateDiscountedPrice(productTotalPrice, productBulkDiscountRate);
  }

  return { totalItems, totalPrice, discountedTotalPrice };
};
const createBonusPointsTag = () => {
  const pointTagElement = document.createElement('span');
  pointTagElement.id = 'loyalty-points';
  pointTagElement.className = 'text-blue-500 ml-2';

  document.getElementById('cart-total').appendChild(pointTagElement);
  return pointTagElement;
};
export const updateBonusPoints = (bonusPoints, totalPrice) => {
  const updatedBonusPoints = bonusPoints + Math.floor(totalPrice / 1000);

  const $pointTagElement = document.getElementById('loyalty-points') || createBonusPointsTag();
  $pointTagElement.textContent = `(포인트: ${updatedBonusPoints})`;

  return updatedBonusPoints;
};
