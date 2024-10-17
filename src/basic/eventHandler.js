import CartItem from './components/CartItem';
import ProductStore from './store';
import { getItemQuentity } from './utils/misc';
import { updateCartInfo } from './utils/cart';

function handleClickCartButton(e) {
  const target = e.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;
  const $cartItem = document.getElementById(productId);
  const productInfo = ProductStore.getProductById(productId);

  if (target.classList.contains('quantity-change')) {
    updateItemQuantity(target, $cartItem, productInfo);
  } else if (target.classList.contains('remove-item')) {
    const removeQuantity = getItemQuentity($cartItem);
    productInfo.stock += removeQuantity;
    $cartItem.remove();
  }

  updateCartInfo();
}

function updateItemQuantity(target, item, productInfo) {
  const quantityChange = parseInt(target.dataset.change);
  const currentQuantity = getItemQuentity(item);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= productInfo.stock + currentQuantity) {
    const $span = item.querySelector('span');
    const itemInfo = $span.textContent.split('x ')[0];
    $span.textContent = `${itemInfo}x ${newQuantity}`;
    productInfo.stock -= quantityChange;
  } else if (newQuantity <= 0) {
    item.remove();
    productInfo.stock -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

function handleClickAddButton() {
  const $productSelect = document.getElementById('product-select');
  const selectedItemId = $productSelect.value;
  const addedItem = ProductStore.getProductById(selectedItemId);

  if (!addedItem || addedItem.stock <= 0) {
    console.error('선택한 상품이 없거나 재고가 부족합니다.');
    return;
  }
  const existingCartItem = document.getElementById(addedItem.id);

  if (existingCartItem) {
    updateCartItem(existingCartItem, addedItem);
  } else {
    addNewCartItem(addedItem);
  }

  addedItem.stock--;
  updateCartInfo();
  ProductStore.setLastSelectItemId(selectedItemId);
}

function updateCartItem(existItem, addedItem) {
  const $quantitySpan = existItem.querySelector('span');
  const currentQuantity = getItemQuentity(existItem);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= addedItem.stock + currentQuantity) {
    $quantitySpan.textContent = `${addedItem.name} - ${addedItem.price}원 x ${newQuantity}`;
  } else {
    alert('재고가 부족합니다.');
  }
}

function addNewCartItem(item) {
  const $cartInfo = document.getElementById('cart-items');
  const newCartItem = CartItem(item);

  $cartInfo.innerHTML += newCartItem;
}

export const setupEventListner = () => {
  const $addButton = document.getElementById('add-to-cart');
  const $cartInfo = document.getElementById('cart-items');

  $addButton.addEventListener('click', handleClickAddButton);
  $cartInfo.addEventListener('click', handleClickCartButton);
};
