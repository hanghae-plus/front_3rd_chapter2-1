import calculateCart from './calculateCart';
import { setLuckySale, setSuggestSale } from './eventManager';
import renderCartItem from './renderCartItem';
import renderHome from './renderHome';
import updateSelOpts from './updateSelOpts';

let productList, $select, $addBtn, $cartList, $sum, $stockInfo;
let lastSelectedProductId;

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
  $stockInfo = document.getElementById('stock-status');

  updateSelOpts($select, productList);

  calculateCart({
    prodList: productList,
    sumDiv: $sum,
    cartsDiv: $cartList,
    stockInfoDiv: $stockInfo,
  });

  setLuckySale(productList, $select);
  setSuggestSale(productList, $select, lastSelectedProductId);
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

  calculateCart({
    prodList: productList,
    sumDiv: $sum,
    cartsDiv: $cartList,
    stockInfoDiv: $stockInfo,
  });

  lastSelectedProductId = selectedId;
});

$cartList.addEventListener('click', function (event) {
  let tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else alert('재고가 부족합니다.');
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calculateCart({
      prodList: productList,
      sumDiv: $sum,
      cartsDiv: $cartList,
      stockInfoDiv: $stockInfo,
    });
  }
});
