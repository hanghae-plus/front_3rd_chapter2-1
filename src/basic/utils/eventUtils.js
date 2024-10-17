import { productList } from '../commonData';
import { createNewItemDiv, getItemQuantity, renderCart } from './renderUtils';

export let lastAddedProduct;

export function handleItemAddButtonClick({
  $addButton,
  $productSelect,
  $cartItemsDiv,
  $cartTotalDiv,
  $stockStatusDiv,
}) {
  $addButton.addEventListener('click', function () {
    const selectedItemId = $productSelect.value;
    const selectedProduct = productList.find(
      (product) => product.id === selectedItemId,
    );
    if (!selectedProduct || selectedProduct.quantity <= 0) return;
    const $selectedItem = document.getElementById(selectedItemId);
    if ($selectedItem) {
      updateSelectedItem($selectedItem, selectedProduct);
    } else {
      addNewItem($cartItemsDiv, selectedProduct);
    }
    renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
    lastAddedProduct = selectedItemId;
  });
}

function updateSelectedItem($selectedItem, selectedProduct) {
  const newQuantity = getItemQuantity($selectedItem) + 1;
  if (newQuantity <= selectedProduct.quantity) {
    $selectedItem.querySelector('span').textContent =
      `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;
    selectedProduct.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
}

function addNewItem($cartItemsDiv, selectedProduct) {
  const $newItemDiv = createNewItemDiv(selectedProduct);
  $cartItemsDiv.appendChild($newItemDiv);
  selectedProduct.quantity--;
}

export function handleCartItemsClick({
  $cartItemsDiv,
  $cartTotalDiv,
  $stockStatusDiv,
}) {
  $cartItemsDiv.addEventListener('click', function (event) {
    const target = event.target;
    if (!hasClickButton(target)) {
      return;
    }
    const itemId = target.dataset.productId;
    const $item = document.getElementById(itemId);
    const product = productList.find((product) => product.id === itemId);
    if (target.classList.contains('quantity-change')) {
      updateItem({ target, $item, product });
    }

    if (target.classList.contains('remove-item')) {
      removeItem({ $item, product });
    }
    renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
  });
}

function hasClickButton(target) {
  return (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  );
}

function updateItem({ target, $item, product }) {
  const changedQuantity = parseInt(target.dataset.change);
  const newQuantity = getItemQuantity($item) + changedQuantity;
  const itemTitle = $item.querySelector('span').textContent.split('x ')[0];
  if (newQuantity > 0 && changedQuantity <= product.quantity) {
    $item.querySelector('span').textContent = `${itemTitle}x ${newQuantity}`;
    product.quantity -= changedQuantity;
  } else if (newQuantity <= 0) {
    $item.remove();
    product.quantity -= changedQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
}

function removeItem({ $item, product }) {
  const removeQuantity = getItemQuantity($item);
  product.quantity += removeQuantity;
  $item.remove();
}
