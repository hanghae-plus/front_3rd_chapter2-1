import { calculateCart } from './controller/calculateCart';
export function handleExistingCartItem(itemElement, product) {
  let currentQty = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  let newQty = currentQty + 1;

  if (newQty <= product.q) {
    updateCartItem(itemElement, product.name, product.val, newQty);
    product.q--;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 새 아이템 추가
export function addNewItemToCart(product, cartsDiv) {
  let newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className = 'flex justify-between items-center mb-2';
  newItem.innerHTML =
    `<span>${product.name} - ${product.val}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>`;
  cartsDiv.appendChild(newItem);
  product.q--;
}

// 장바구니 아이템 업데이트
export function updateCartItem(itemElement, productName, productPrice, quantity) {
  itemElement.querySelector('span').textContent = `${productName} - ${productPrice}원 x ${quantity}`;
}

// 장바구니에 아이템 추가
export function addItemToCart(selectedProductId, prodList, cartsDiv, sumDiv, stockInfoDiv, lastSelRef) {
  const selectedProduct = prodList.find(product => product.id === selectedProductId);
  
  if (!selectedProduct || selectedProduct.q <= 0) {
    return alert('선택한 상품의 재고가 없습니다.');
  }

  let existingCartItem = document.getElementById(selectedProduct.id);
  
  if (existingCartItem) {
    handleExistingCartItem(existingCartItem, selectedProduct);
  } else {
    addNewItemToCart(selectedProduct, cartsDiv);
  }

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
  lastSelRef.current = selectedProductId;
}

// 수량 변경 핸들러
export function handleQuantityChange(itemElem, prod, qtyChange) {
  let currentQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
  let newQty = currentQty + qtyChange;

  if (newQty > 0 && newQty <= prod.q + currentQty) {
    itemElem.querySelector('span').textContent =
      `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
    prod.q -= qtyChange;
  } else if (newQty <= 0) {
    itemElem.remove();
    prod.q -= qtyChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 아이템 삭제 핸들러
export function handleRemoveItem(itemElem, prod) {
  let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
  prod.q += remQty;
  itemElem.remove();
}

// 장바구니 이벤트 핸들러
export function handleCartEvent(event, prodList, cartsDiv, sumDiv, stockInfoDiv) {
  let tgt = event.target;
  
  if (!tgt.classList.contains('quantity-change') && !tgt.classList.contains('remove-item')) return;

  let prodId = tgt.dataset.productId;
  let itemElem = document.getElementById(prodId);
  let prod = prodList.find(product => product.id === prodId);

  if (tgt.classList.contains('quantity-change')) {
    let qtyChange = parseInt(tgt.dataset.change);
    handleQuantityChange(itemElem, prod, qtyChange);
  } else if (tgt.classList.contains('remove-item')) {
    handleRemoveItem(itemElem, prod);
  }

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
}
