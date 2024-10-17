import { DISCOUNT_RATE } from '../constants';
import ProductStore from '../store';
import { getItemQuentity, isTuesday } from './misc';
import { createTotalPriceElement, createBonusPoints, updateStockInfo } from './ui';

export function updateCartInfo() {
  const { finalPrice, finalDiscRate } = calculateFinalPrice();
  createTotalPriceElement(finalPrice, finalDiscRate);
  updateStockInfo();
  createBonusPoints(finalPrice);
}

// 장바구니에 담긴 상품의 총 가격을 계산
export function calculateFinalPrice() {
  const cartItemList = Array.from(document.getElementById('cart-items').children);

  const { totalItemCount, totalPriceOrigin, totalDiscountPrice } =
    calculateTotalPrice(cartItemList);

  const { appliedPrice, discountRate } = applyDiscountRate(
    totalItemCount,
    totalPriceOrigin,
    totalDiscountPrice,
  );

  const finalPrice = isTuesday() ? appliedPrice * 0.9 : appliedPrice;
  const finalDiscRate = isTuesday() ? Math.max(discountRate, 0.1) : discountRate;

  return { finalPrice, finalDiscRate };
}

function calculateTotalPrice(cartItemList) {
  return cartItemList.reduce(
    (acc, currentCartItem) => {
      const currentItemInfo = ProductStore.getProductById(currentCartItem.id);
      const quentity = getItemQuentity(currentCartItem);
      const itemTotalPrice = currentItemInfo.price * quentity;
      const discountRate = quentity >= 10 ? DISCOUNT_RATE[currentCartItem.id] : 0;

      return {
        totalItemCount: acc.totalItemCount + quentity,
        totalPriceOrigin: acc.totalPriceOrigin + itemTotalPrice,
        totalDiscountPrice: acc.totalDiscountPrice + itemTotalPrice * (1 - discountRate),
      };
    },
    { totalItemCount: 0, totalPriceOrigin: 0, totalDiscountPrice: 0 },
  );
}

function applyDiscountRate(totalItemCount, totalPriceBeforeDiscount, discountPrice) {
  if (totalItemCount >= 30) {
    const bulkDiscountPrice = discountPrice * 0.25;
    const itemDiscountPrice = totalPriceBeforeDiscount - discountPrice;

    if (bulkDiscountPrice > itemDiscountPrice) {
      return { appliedPrice: discountPrice * 0.75, discountRate: 0.25 };
    }
  }

  return {
    appliedPrice: discountPrice,
    discountRate: (totalPriceBeforeDiscount - discountPrice) / totalPriceBeforeDiscount,
  };
}
