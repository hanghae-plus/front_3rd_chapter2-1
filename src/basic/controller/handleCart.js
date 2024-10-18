import { calculateCart } from './calculateCart';

/**
 * @function addItemToCart
 * @description 선택된 상품을 장바구니에 추가하거나, 이미 추가된 상품의 수량을 업데이트하고 재고 없을 때 경고 표시
 * @param {string} selectedProductId - 선택된 상품의 ID
 * @param {Array} prodList - 상품 목록 배열
 * @param {HTMLElement} cartsDiv - 장바구니 목록을 보여주는 HTML 요소
 * @param {HTMLElement} sumDiv - 총합계를 보여주는 HTML 요소
 * @param {HTMLElement} stockInfoDiv - 재고 정보를 보여주는 HTML 요소
 * @param {React.RefObject} lastSelRef - 마지막으로 선택된 상품의 ID를 저장하는 ref
 */

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

/**
 * @function handleExistingCartItem
 * @description 이미 장바구니에 추가된 상품의 수량을 업데이트
 * @param {HTMLElement} itemElement - 장바구니에 있는 상품의 HTML 요소
 * @param {Object} product - 상품 객체
 */

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

/**
 * @function addNewItemToCart
 * @description 새로운 상품을 장바구니에 추가
 * @param {Object} product - 추가할 상품 객체
 * @param {HTMLElement} cartsDiv - 장바구니 목록을 보여주는 HTML 요소
 */

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

/**
 * @function handleCartEvent
 * @description 장바구니에서 발생한 이벤트를 처리 수량 변경이나 상품 제거 등의 동작을 수행
 * @param {Event} event - 발생한 이벤트 객체
 * @param {Array} prodList - 상품 목록 배열
 * @param {HTMLElement} cartsDiv - 장바구니 목록을 보여주는 HTML 요소
 * @param {HTMLElement} sumDiv - 총합계를 보여주는 HTML 요소
 * @param {HTMLElement} stockInfoDiv - 재고 정보를 보여주는 HTML 요소
 */

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

/**
 * @function updateCartItem
 * @description 장바구니 내 상품의 HTML 요소를 업데이트
 * @param {HTMLElement} itemElement - 업데이트할 상품의 HTML 요소
 * @param {string} productName - 상품의 이름
 * @param {number} productPrice - 상품의 가격
 * @param {number} quantity - 업데이트할 수량
 */

export function updateCartItem(itemElement, productName, productPrice, quantity) {
  itemElement.querySelector('span').textContent =
    `${productName} - ${productPrice}원 x ${quantity}`;
}

/**
 * @function handleQuantityChange
 * @description 장바구니 내 특정 상품의 수량을 변경, 수량이 0 이하가 되면 상품을 제거
 * @param {HTMLElement} itemElem - 수량을 변경할 상품의 HTML 요소
 * @param {Object} prod - 상품 객체
 * @param {number} quantityChange - 변경할 수량
 */

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

/**
 * @function handleRemoveItem
 * @description 장바구니에서 특정 상품을 제거
 * @param {HTMLElement} itemElement - 제거할 상품의 HTML 요소
 * @param {Object} product - 제거할 상품 객체
 */

export function handleRemoveItem(itemElement, product) {
  const removedQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  product.quantity += removedQuantity;
  itemElement.remove();
}
