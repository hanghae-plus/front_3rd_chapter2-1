import { calculateCart } from './calculateCart';

export function addItemToCart(
  selectedProductId,
  prodList,
  cartsDiv,
  sumDiv,
  stockInfoDiv,
  lastSelRef,
) {
  const selectedProduct = prodList.find((product) => product.id === selectedProductId);

  if (!selectedProduct || selectedProduct.quantity <= 0) {
    return alert('선택한 상품의 재고가 없습니다.');
  }

  const existingCartItem = document.getElementById(selectedProduct.id);

  if (existingCartItem) {
    handleExistingCartItem(existingCartItem, selectedProduct);
  } else {
    addNewItemToCart(selectedProduct, cartsDiv);
  }

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
  lastSelRef.current = selectedProductId;
}

export function handleExistingCartItem(itemElement, product) {
  const currentQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.quantity) {
    updateCartItem(itemElement, product.name, product.price, newQuantity);
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
}

export function addNewItemToCart(product, cartsDiv) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML = `<span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>`;
  cartsDiv.appendChild(newItem);
  product.quantity--;
}

export function handleCartEvent(event, prodList, cartsDiv, sumDiv, stockInfoDiv) {
  const target = event.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item'))
  {return;}

  const productId = target.dataset.productId;
  const itemElement = document.getElementById(productId);
  const product = prodList.find((prod) => prod.id === productId);

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    handleQuantityChange(itemElement, product, quantityChange);
  } else if (target.classList.contains('remove-item')) {
    handleRemoveItem(itemElement, product);
  }

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
}

export function updateCartItem(itemElement, productName, productPrice, quantity) {
  itemElement.querySelector('span').textContent =
    `${productName} - ${productPrice}원 x ${quantity}`;
}

export function handleQuantityChange(itemElem, prod, quantityChange) {
  const currentQuantity = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= prod.quantity + currentQuantity) {
    itemElem.querySelector('span').textContent =
      `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQuantity}`;
    prod.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    itemElem.remove();
    prod.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

export function handleRemoveItem(itemElement, product) {
  const removedQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  product.quantity += removedQuantity;
  itemElement.remove();
}
