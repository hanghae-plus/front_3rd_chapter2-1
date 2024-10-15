import { getTargetItemElementQuantity } from '../utils/cart';
import { createNewCartItem, removeCartItemElement, renderCartItemInfo } from '../views/cart';

const addToCart = ($targetCartItem, targetProduct) => {
  if (!$targetCartItem) {
    createNewCartItem(targetProduct);
    targetProduct.quantity--;
    return;
  }

  const currentItemQuantity = getTargetItemElementQuantity($targetCartItem);
  const newItemQuantity = currentItemQuantity + 1;

  // BUG: 로직 개선
  const isStockRemain = newItemQuantity <= targetProduct.quantity;
  if (isStockRemain) {
    renderCartItemInfo(targetProduct, newItemQuantity, $targetCartItem);
    targetProduct.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

const removeCartItem = (targetProduct, $itemElement, restoreQuantity) => {
  targetProduct.quantity += restoreQuantity;
  removeCartItemElement($itemElement);
};
const changeCartItemQuantity = (clickedElement, $itemElement, targetProduct) => {
  const quantityChangeAmount = parseInt(clickedElement.dataset.change);
  const currentItemQuantity = getTargetItemElementQuantity($itemElement);
  const newItemQuantity = currentItemQuantity + quantityChangeAmount;

  const isStockRemain = newItemQuantity <= targetProduct.quantity + currentItemQuantity;

  if (!isStockRemain) {
    alert('재고가 부족합니다.');
  } else if (newItemQuantity > 0) {
    renderCartItemInfo(targetProduct, newItemQuantity, $itemElement);
    targetProduct.quantity -= quantityChangeAmount;
  } else {
    removeCartItem(targetProduct, $itemElement, 1);
  }
};

export { addToCart, removeCartItem, changeCartItemQuantity };
