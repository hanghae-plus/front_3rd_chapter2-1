import { discountPrice, getRandomItem, probability } from './utils';

// 상수 변수
const LOYALTY_POINT_PERCENTAGE = 0.1;
const LUCKY_DRAW_INTERVAL = 30 * 1000; // 30초
const LUCKY_DRAW_PERCENTAGE = 30;
const LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE = 20;
const SUGGESTED_PRODUCT_INTERVAL = 60 * 1000; // 1분
const SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE = 5;

let prodList;
let $productSelect;
let $addButton;
let $cartItems;
let $cartTotal;
let $stockStatus;
let lastAddedProductId = null;
let loyaltyPoints = 0;
let totalPrice = 0;
let itemCount = 0;

// Utils
function canLuckyDraw() {
  return probability(LUCKY_DRAW_PERCENTAGE);
}

function getRandomProduct() {
  return getRandomItem(prodList);
}

function discountProduct(product, percentage, round = false) {
  const discountedPrice = discountPrice(product.val, percentage);
  product.val = round ? Math.round(discountedPrice) : discountedPrice;

  return product;
}

/**
 * 상품 선택 셀렉트박스를 렌더링
 */
function renderProductSelect() {
  $productSelect.innerHTML = '';

  prodList.forEach((product) => {
    const opt = document.createElement('option');

    opt.value = product.id;
    opt.textContent = `${product.name} - ${product.val}원`;

    // 재고가 없을 경우 비활성화
    if (product.q === 0) opt.disabled = true;

    $productSelect.appendChild(opt);
  });
}

/**
 * 장바구니에 담긴 상품의 총 금액을 기준으로 포인트를 계산하고, 렌더링
 */
function renderLoyaltyPoints(points) {
  let $el = document.getElementById('loyalty-points');
  if (!$el) {
    $el = document.createElement('span');
    $el.id = 'loyalty-points';
    $el.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($el);
  }

  $el.textContent = `(포인트: ${points})`;
}

function renderStockStatus() {
  $stockStatus.textContent = prodList
    .filter(({ q }) => q < 5)
    .map(({ q, name }) => {
      return `${name}: ${q > 0 ? `재고 부족 (${q}개 남음)` : '품절'}`;
    })
    .join('\n');
}

/**
 * 현재 장바구니에 담긴 상품의 총 합을 기준으로 포인트를 계산합니다
 * @param {number} currentPoints - 현재 누적된 포인트
 * @param {number} cartTotal - 장바구니에 담긴 상품의 총 합
 * @returns {number} 계산된 포인트
 */
function calcLoyaltyPoints(currentPoints = 0, cartTotal = 0) {
  return currentPoints + Math.floor(cartTotal * (LOYALTY_POINT_PERCENTAGE / 100));
}

function calcCart() {
  totalPrice = 0;
  itemCount = 0;
  const cartItems = $cartItems.children;
  let subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      const q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCount += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalPrice += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCount >= 30) {
    const bulkDisc = totalPrice * 0.25;
    const itemDisc = subTot - totalPrice;
    if (bulkDisc > itemDisc) {
      totalPrice = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalPrice) / subTot;
    }
  } else {
    discRate = (subTot - totalPrice) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
    $cartTotal.appendChild(span);
  }
  renderStockStatus();

  // 장바구니에 담긴 상품 금액을 기준으로 포인트 업데이트
  const newLoyaltyPoints = calcLoyaltyPoints(loyaltyPoints, totalPrice);
  renderLoyaltyPoints(newLoyaltyPoints);
  loyaltyPoints = newLoyaltyPoints;
}

function main() {
  // 상품 리스트 초기화
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  // 엘리먼트 생성 및 초기화
  const $root = document.getElementById('app');

  // 장바구니 페이지
  const $cart = document.createElement('div');
  $cart.id = 'cart';
  $cart.className = 'bg-gray-100 p-8';

  // 장바구니 페이지 inner
  const $cartInner = document.createElement('div');
  $cartInner.id = 'cart-inner';
  $cartInner.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  // 페이지 제목
  const $title = document.createElement('h1');
  $title.className = 'text-2xl font-bold mb-4';
  $title.textContent = '장바구니';

  // 장바구니 총액
  $cartTotal = document.createElement('div');
  $cartTotal.id = 'cart-total';
  $cartTotal.className = 'text-xl font-bold my-4';

  // 상품 리스트
  $productSelect = document.createElement('select');
  $productSelect.id = 'product-select';
  $productSelect.className = 'border rounded p-2 mr-2';

  // 상품 추가 버튼
  $addButton = document.createElement('button');
  $addButton.id = 'add-to-cart';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $addButton.textContent = '추가';

  // 장바구니에 담긴 상품 리스트
  $cartItems = document.createElement('div');
  $cartItems.id = 'cart-items';

  // 상품 추가 버튼 클릭 이벤트 핸들러
  $addButton.addEventListener('click', () => {
    // 장바구니에 새로운 상품을 추가
    const addCartItem = (product, quantity = 1) => {
      const $el = document.createElement('div');
      $el.id = product.id;
      $el.className = 'flex justify-between items-center mb-2';

      $el.innerHTML =
        `<span>${product.name} - ${product.val}원 x ${quantity}</span><div>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          product.id
        }" data-change="-1">-</button>` +
        `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
          product.id
        }" data-change="1">+</button>` +
        `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${
          product.id
        }">삭제</button></div>`;

      $cartItems.appendChild($el);
    };

    // 장바구니에 추가되어 있는 상품 업데이트
    const updateCartItem = (product, quantity = 1) => {
      const $cartItem = document.getElementById(product.id);
      $cartItem.querySelector('span').textContent = `${product.name} - ${product.val}원 x ${quantity}`;
    };

    // 현재 선택된 상품
    const selectedProductId = $productSelect.value;
    const productToAdd = prodList.find((p) => p.id === selectedProductId);

    if (!productToAdd || productToAdd.q === 0) {
      return;
    }

    // 마지막에 장바구니에 담은 상품 저장
    lastAddedProductId = productToAdd.id;

    // 장바구니에 상품이 추가되어 있을 경우 업데이트
    const $cartItem = document.getElementById(productToAdd.id);
    if ($cartItem) {
      const newQuantity = parseInt($cartItem.querySelector('span').textContent.split('x ')[1], 10) + 1;
      if (newQuantity > productToAdd.q) {
        alert('재고가 부족합니다.');
        return;
      }

      updateCartItem(productToAdd, newQuantity);
      productToAdd.q -= 1;
    } else {
      // 장바구니에 상품을 새로 추가할 경우
      addCartItem(productToAdd);
      productToAdd.q -= 1;
    }

    calcCart();
  });

  $cartItems.addEventListener('click', (event) => {
    const { target } = event;

    // 수량 변경 버튼 또는 삭제 버튼
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const { productId } = target.dataset;
      const $item = document.getElementById(productId);
      const targetProduct = prodList.find((product) => product.id === productId);
      const [title, quantity] = $item.querySelector('span').textContent.split('x ');
      const currentQuantity = parseInt(quantity);

      // 수량 변경 로직
      if (target.classList.contains('quantity-change')) {
        const qtyChange = parseInt(target.dataset.change);
        const newQuantity = currentQuantity + qtyChange;

        if (newQuantity > 0 && newQuantity <= targetProduct.q + currentQuantity) {
          // 장바구니에 담긴 상품 개수 업데이트
          $item.querySelector('span').textContent = `${title}x ${newQuantity}`;
          targetProduct.q -= qtyChange;
        } else if (newQuantity <= 0) {
          // 장바구니에서 상품 삭제
          $item.remove();
          targetProduct.q += Math.abs(qtyChange);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        // 장바구니에서 상품 삭제
        targetProduct.q += currentQuantity;
        $item.remove();
      }

      calcCart();
    }
  });

  // 상품 재고 상태 문구
  $stockStatus = document.createElement('div');
  $stockStatus.id = 'stock-status';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';

  $cartInner.appendChild($title);
  $cartInner.appendChild($cartItems);
  $cartInner.appendChild($cartTotal);
  $cartInner.appendChild($productSelect);
  $cartInner.appendChild($addButton);
  $cartInner.appendChild($stockStatus);

  $cart.appendChild($cartInner);

  $root.appendChild($cart);

  renderProductSelect();
  calcCart();

  // 30초 마다 무작위로 상품을 하나 선택하고, 30%의 확률로 20% 할인을 적용
  setTimeout(() => {
    setInterval(() => {
      if (canLuckyDraw()) {
        const luckyProduct = getRandomProduct();

        if (luckyProduct.q > 0) {
          discountProduct(luckyProduct, LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE);

          alert(`번개세일! ${luckyProduct.name}이(가) ${LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE}% 할인 중입니다!`);

          renderProductSelect();
        }
      }
    }, LUCKY_DRAW_INTERVAL);
  }, Math.random() * 10000);

  // 장바구니에 마지막으로 추가된 상품을 제외하고, 무작위로 상품을 하나 선택해서 5% 할인을 적용
  setTimeout(() => {
    setInterval(() => {
      if (lastAddedProductId === null) {
        return;
      }

      const suggestedProduct = prodList.find((item) => {
        return item.id !== lastAddedProductId && item.q > 0;
      });

      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE}% 추가 할인!`,
        );

        discountProduct(suggestedProduct, SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE);

        renderProductSelect();
      }
    }, SUGGESTED_PRODUCT_INTERVAL);
  }, Math.random() * 20000);
}

main();
