import { getTargetItemElementQuantity, updateCartItemInfo } from './cart';

const createNewItem = (targetProduct) => {
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
const addToCart = ($targetCartItem, targetProduct) => {
  if (!$targetCartItem) {
    createNewItem(targetProduct);
    targetProduct.quantity--;
    return;
  }

  const currentItemQuantity = getTargetItemElementQuantity($targetCartItem);
  const newItemQuantity = currentItemQuantity + 1;

  // BUG: 로직 개선
  const isStockRemain = newItemQuantity <= targetProduct.quantity;
  if (isStockRemain) {
    updateCartItemInfo(targetProduct, newItemQuantity, $targetCartItem);
    targetProduct.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

// TODO: handleAddToCart랑 중복되는 부분 합칠 수 있는 지 확인
const removeCartItem = (targetProduct, $itemElement, restoreQuantity) => {
  targetProduct.quantity += restoreQuantity;
  $itemElement.remove();
};
const changeCartItemQuantity = (clickedElement, $itemElement, targetProduct) => {
  const quantityChangeAmount = parseInt(clickedElement.dataset.change);
  const currentItemQuantity = getTargetItemElementQuantity($itemElement);
  const newItemQuantity = currentItemQuantity + quantityChangeAmount;

  const isStockRemain = newItemQuantity <= targetProduct.quantity + currentItemQuantity;

  if (!isStockRemain) {
    alert('재고가 부족합니다.');
  } else if (newItemQuantity > 0) {
    updateCartItemInfo(targetProduct, newItemQuantity, $itemElement);
    targetProduct.quantity -= quantityChangeAmount;
  } else {
    removeCartItem(targetProduct, $itemElement, 1);
  }
};

export { addToCart, removeCartItem, changeCartItemQuantity };
