import { createDiscountInfo } from './discount';
import { renderTextContent } from './shared';

export const renderCartItemInfo = (targetProduct, newItemQuantity, targetCartItem) => {
  const newCartItemInfo = `${targetProduct.name} - ${targetProduct.price}원 x ${newItemQuantity}`;
  renderTextContent(targetCartItem.querySelector('span'), newCartItemInfo);
};
export const renderCartTotalInfo = (discountedTotalPrice, discountRate) => {
  const $cartTotalInfo = document.getElementById('cart-total');

  renderTextContent($cartTotalInfo, `총액: ${Math.round(discountedTotalPrice)}원`);
  if (discountRate > 0) {
    const $discountInfo = createDiscountInfo(discountRate);
    $cartTotalInfo.appendChild($discountInfo);
  }
};

export const createNewCartItem = (targetProduct) => {
  const newItem = document.createElement('div');
  newItem.id = targetProduct.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML =
    '<span>' +
    targetProduct.name +
    ' - ' +
    targetProduct.price +
    '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    targetProduct.id +
    '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    targetProduct.id +
    '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
    targetProduct.id +
    '">삭제</button></div>';
  document.getElementById('cart-items').appendChild(newItem);
};
export const createBonusPointsTag = () => {
  const pointTagElement = document.createElement('span');
  pointTagElement.id = 'loyalty-points';
  pointTagElement.className = 'text-blue-500 ml-2';

  document.getElementById('cart-total').appendChild(pointTagElement);
  return pointTagElement;
};

export const removeCartItemElement = ($itemElement) => {
  $itemElement.remove();
};
