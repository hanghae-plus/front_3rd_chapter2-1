import { PRODUCT_LIST } from './constant';
import { updateLastAddedItem, updateTotalPrice } from './service';

export function attatchEventListener() {
  const $addToCartBtn = document.getElementById('add-to-cart');
  const $cartItemList = document.getElementById('cart-items');

  $addToCartBtn.addEventListener('click', handleClickAddToCart);
  $cartItemList.addEventListener('click', (e) => handleClickCartItem(e));
}

function handleClickAddToCart() {
  const $cartItemList = document.getElementById('cart-items');
  const $productSelectBox = document.getElementById('product-select');
  const selectedItem = $productSelectBox.value;
  const selectedProduct = PRODUCT_LIST.find((product) => {
    return product.id === selectedItem;
  });

  if (!selectedProduct) {
    alert('제품을 선택해주세요.');
    return;
  }

  if (selectedProduct.quantity === 0) {
    alert('재고가 부족합니다.');
    return;
  }

  const $product = document.getElementById(selectedProduct.id);
  if ($product) {
    // 제품이 장바구니에 추가되어있는 경우 수량 업데이트
    const $productInfo = $product.querySelector('span');
    const prevQuantity = parseInt($productInfo.textContent.split('x ')[1]);
    const curQuantity = prevQuantity + 1;

    $productInfo.textContent = `${selectedProduct.name} - ${selectedProduct.val}원 x ${curQuantity}`;
  } else {
    // 제품이 장바구니에 없는 경우 장바구니에 새로 추가
    const $newItem = document.createElement('div');

    $newItem.id = selectedProduct.id;
    $newItem.className = 'flex justify-between items-center mb-2';
    $newItem.innerHTML = `
          <span>${selectedProduct.name} - ${selectedProduct.val}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                    data-product-id="${selectedProduct.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                    data-product-id="${selectedProduct.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                    data-product-id="${selectedProduct.id}">삭제</button>
          </div>
        `;

    $cartItemList.appendChild($newItem);
  }
  selectedProduct.quantity--;

  updateLastAddedItem();
  updateTotalPrice();
}

function handleClickCartItem(event) {
  const clickedElement = event.target;
  const isQuantityChangeBtn =
    clickedElement.classList.contains('quantity-change');
  const isRemoveItemBtn = clickedElement.classList.contains('remove-item');

  if (!isQuantityChangeBtn && !isRemoveItemBtn) return;

  const productId = clickedElement.dataset.productId;
  const product = PRODUCT_LIST.find((item) => item.id === productId);
  const $product = document.getElementById(productId);
  const $productInfo = $product.querySelector('span');
  const curQuantity = parseInt($productInfo.textContent.split('x ')[1]);

  if (isQuantityChangeBtn) {
    const changedQuantity = parseInt(clickedElement.dataset.change);
    const newQuantity = curQuantity + changedQuantity;
    if (newQuantity > 0 && newQuantity <= product.quantity + curQuantity) {
      $productInfo.textContent =
        $productInfo.textContent.split('x ')[0] + 'x ' + newQuantity;
      product.quantity -= changedQuantity;
    } else if (newQuantity <= 0) {
      $product.remove();
      product.quantity -= changedQuantity;
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (isRemoveItemBtn) {
    product.quantity += curQuantity;
    $product.remove();
  }

  updateTotalPrice();
}
