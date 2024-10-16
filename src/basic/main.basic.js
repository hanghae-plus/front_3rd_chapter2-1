import calculateCart from './calculateCart';
import { setLuckySale, setSuggestSale } from './eventManager';
import renderCartItem from './renderCartItem';
import renderHome from './renderHome';
import updateSelectOptions from './updateSelectOptions';

let productList, $select, $addBtn, $cartList, $sum, $stock;
let lastSelectedId;

function main() {
  productList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  let root = document.getElementById('app');
  root.appendChild(renderHome());

  $select = document.getElementById('product-select');
  $addBtn = document.getElementById('add-to-cart');
  $cartList = document.getElementById('cart-items');
  $sum = document.getElementById('cart-total');
  $stock = document.getElementById('stock-status');

  updateSelectOptions($select, productList);

  calculateCart({ productList, $sum, $cartList, $stock });

  setLuckySale(productList, $select);
  setSuggestSale(productList, $select, lastSelectedId);
}

main();

$addBtn.addEventListener('click', function () {
  let selectedId = $select.value;
  let selectedProduct = productList.find((p) => p.id === selectedId);
  const { id, name, val } = selectedProduct;

  const canAdd = selectedProduct && selectedProduct.q > 0;
  if (!canAdd) return null;

  // 선택한 상품이 이미 장바구니에 있는 경우
  let $selectedCart = document.getElementById(selectedProduct.id);
  if ($selectedCart) {
    const quantity = parseInt($selectedCart.querySelector('span').textContent.split('x ')[1]);
    const newQuantity = quantity + 1;

    const availableQuantity = newQuantity <= selectedProduct.q;
    if (!availableQuantity) return alert('재고가 부족합니다.');

    $selectedCart.querySelector('span').textContent = `${name} - ${val}원 x ${newQuantity}`;
    selectedProduct.q--;
  }
  // 선택한 상품이 장바구니에 없는 경우
  else {
    const $cartItem = renderCartItem({ id, name, val });
    $cartList.appendChild($cartItem);
    selectedProduct.q--;
  }

  calculateCart({ productList, $sum, $cartList, $stock });

  lastSelectedId = selectedId;
});

$cartList.addEventListener('click', function (event) {
  const $target = event.target;
  const isChangeButton = $target.classList.contains('quantity-change');
  const isRemoveButton = $target.classList.contains('remove-item');
  const isCartItemButton = isChangeButton || isRemoveButton;
  if (!isCartItemButton) return null;

  const id = $target.dataset.productId;
  const $item = document.getElementById(id);
  const product = productList.find((p) => p.id === id);

  if (isChangeButton) {
    const change = parseInt($target.dataset.change);
    const quantity = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    const newQuantity = quantity + change;
    const availableQuantity = newQuantity > 0 && newQuantity <= product.q + quantity;
    const zeroQuantity = newQuantity <= 0;

    if (availableQuantity) {
      $item.querySelector('span').textContent =
        $item.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity;
      product.q -= change;
    } else if (zeroQuantity) {
      $item.remove();
      product.q -= change;
    } else alert('재고가 부족합니다.');
  } else if (isRemoveButton) {
    let removeQuantity = parseInt($item.querySelector('span').textContent.split('x ')[1]);
    product.q += removeQuantity;
    $item.remove();
  }

  calculateCart({ productList, $sum, $cartList, $stock });
});
