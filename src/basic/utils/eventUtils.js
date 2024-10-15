import { productList } from '../commonData';
import { getItemQuantity, renderCart } from './renderUtils';

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
      // 기존 상품 숫자 업데이트
      const newQuantity = getItemQuantity($selectedItem) + 1;
      if (newQuantity <= selectedProduct.quantity) {
        $selectedItem.querySelector('span').textContent =
          selectedProduct.name +
          ' - ' +
          selectedProduct.price +
          '원 x ' +
          newQuantity;
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 상품 추가
      var newItem = document.createElement('div');
      newItem.id = selectedProduct.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        selectedProduct.name +
        ' - ' +
        selectedProduct.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        selectedProduct.id +
        '">삭제</button></div>';
      $cartItemsDiv.appendChild(newItem);
      selectedProduct.quantity--;
    }
    renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
    lastAddedProduct = selectedItemId;
  });
}

export function handleCartItemsClick({
  $cartItemsDiv,
  $cartTotalDiv,
  $stockStatusDiv,
}) {
  $cartItemsDiv.addEventListener('click', function (event) {
    var tgt = event.target;

    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      var prodId = tgt.dataset.productId;
      var itemElem = document.getElementById(prodId);
      var prod = productList.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        var qtyChange = parseInt(tgt.dataset.change);
        var newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.quantity +
              parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1],
              )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.quantity -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        var remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1],
        );
        prod.quantity += remQty;
        itemElem.remove();
      }
      renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);
    }
  });
}
