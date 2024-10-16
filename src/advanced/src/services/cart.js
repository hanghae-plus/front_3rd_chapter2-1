import { getTargetItemElementQuantity } from '../utils/cart';
import { createBonusPointsTag, renderCartTotalInfo } from '../views/cart';
import { renderProductsStockInfo } from '../views/product';
import { renderTextContent } from '../views/shared';

import {
  calculateDayDiscount,
  calculateDiscountedPrice,
  calculateTotalProductsBulkDiscount,
  getProductBulkDiscountRate,
} from './discount';
import { products } from './product';

const updateCartInfos = (bonusPoints) => {
  const { totalItems, totalPrice, discountedTotalPrice } = calculateCartTotals();

  const updatedTotalPriceAndDiscountRate = calculateTotalProductsBulkDiscount(
    totalItems,
    totalPrice,
    discountedTotalPrice,
  );
  const { updatedTotalPrice, discountRate } = calculateDayDiscount(updatedTotalPriceAndDiscountRate);

  renderCartTotalInfo(updatedTotalPrice, discountRate);
  bonusPoints = updateBonusPoints(bonusPoints, updatedTotalPrice);
  renderProductsStockInfo();

  return bonusPoints;
};

const calculateCartTotals = () => {
  let totalItems = 0;
  let totalPrice = 0;
  let discountedTotalPrice = 0;

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
const updateBonusPoints = (bonusPoints, totalPrice) => {
  const updatedBonusPoints = bonusPoints + Math.floor(totalPrice / 1000);

  const $pointTagElement = document.getElementById('loyalty-points') || createBonusPointsTag();
  renderTextContent($pointTagElement, `(포인트: ${updatedBonusPoints})`);

  return updatedBonusPoints;
};

export { updateCartInfos, updateBonusPoints };
