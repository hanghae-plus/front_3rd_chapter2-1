//DOM설정
let $productSelect;
let $productAddBtn;
let $cartItems;
let $cartTotal;
let $stockStatus;
let lastSelectedId;

//전역변수
let point = 0;
let totalPrice = 0;
let itemCount = 0;
let productList = [
  { id: 'p1', name: '상품1', price: 10000, count: 50 },
  { id: 'p2', name: '상품2', price: 20000, count: 30 },
  { id: 'p3', name: '상품3', price: 30000, count: 20 },
  { id: 'p4', name: '상품4', price: 15000, count: 0 },
  { id: 'p5', name: '상품5', price: 25000, count: 10 },
];

//------constants-----//
//랜덤상품 할인 시
const RANDOM_DISCOUNT_PER = 0.2;
const RANDOM_DISCOUNT_INTERVAL = 30000;
const RANDOM_MAX_DELAY = 10000;
const RANDOM_DISCOUNT_PROBABILITY = 0.3;

//추천상품 할인 시
const ADDITIONAL_DISCOUNT_PER = 0.05;
const RECOMMEND_DISCOUNT_INTERVAL = 6000;
const RECOMMEND_MAX_DELAY = 2000;

function main() {
  const $root = document.getElementById('app');
  const $container = createCartUI();
  $root.appendChild($container);

  renderProductSelect();
  processCart();

  //랜덤할인
  alertRandomDiscountWithDelay(productList);

  //추천할인
  alertRecommendDiscountWithDelay(productList, lastSelectedId);
}
main();

// 장바구니 UI 생성 함수
function createCartUI() {
  const $container = createElement('div', { className: 'bg-gray-100 p-8' });
  const $wrap = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const $cartTitle = createElement('h1', { className: 'text-2xl font-bold mb-4' }, '장바구니');
  $cartItems = createElement('div', { id: 'cart-items' });
  $cartTotal = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
  $productSelect = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  $productAddBtn = createElement(
    'button',
    { id: 'add-to-cart', className: 'bg-blue-500 text-white px-4 py-2 rounded' },
    '추가',
  );
  $stockStatus = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  // 장바구니 UI 요소를 랩에 추가
  $wrap.appendChild($cartTitle);
  $wrap.appendChild($cartItems);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($productAddBtn);
  $wrap.appendChild($stockStatus);

  // 컨테이너에 랩 추가
  $container.appendChild($wrap);

  return $container;
}

function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);

  // 속성 설정
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  // 텍스트 내용이 있으면 추가
  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

//상품 선택 셀렉터 UI표시
function renderProductSelect() {
  $productSelect.innerHTML = '';
  productList.forEach(product => {
    let $opt = document.createElement('option');
    $opt.value = product.id;

    $opt.textContent = product.name + ' - ' + product.price + '원';
    if (product.count === 0) $opt.disabled = true;
    $productSelect.appendChild($opt);
  });
}

// 장바구니 계산 및 업데이트 메인 함수
function processCart() {
  let cartItems = $cartItems.children;

  // 1. 장바구니 총액 계산
  let { totalBeforeDiscount } = calculateCartTotal(cartItems);

  // 2. 총 할인 계산
  let { totalDiscountRate } = calculateTotalDiscount(totalBeforeDiscount);

  // 3. 화요일 추가 할인 적용
  let { totalDiscountRate: finalTotalDiscountRate } = applyTuesdayDiscount(totalDiscountRate);

  // 4. 장바구니 총액 업데이트
  renderCartTotal(finalTotalDiscountRate);
  renderStockStatus(); // 재고 상태 업데이트
  renderPoint(); // 포인트 업데이트
}

// 장바구니 총액 계산 함수
function calculateCartTotal(cartItems) {
  let totalBeforeDiscount = 0;
  totalPrice = 0;
  itemCount = 0;

  // 각 카트 아이템 처리
  for (let i = 0; i < cartItems.length; i++) {
    let curItem = productList.find(product => product.id === cartItems[i].id);
    let curItemCount = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    let curItemTotalPrice = curItem.price * curItemCount;
    let curItemDiscounts = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };
    let curItemDiscount = 0;

    itemCount += curItemCount;
    totalBeforeDiscount += curItemTotalPrice;

    if (curItemCount >= 10) {
      curItemDiscount = curItemDiscounts[curItem.id];
    }

    totalPrice += curItemTotalPrice * (1 - curItemDiscount);
  }

  // 할인 전 총액 리턴해줌, totalPrice, itemCount는 전역변수라 리턴 생략
  return { totalBeforeDiscount };
}

// 총 할인율 계산
function calculateTotalDiscount(totalBeforeDiscount) {
  let totalDiscountRate = 0;

  if (itemCount >= 30) {
    let bulkDiscount = totalPrice * 0.25;
    let itemDiscount = totalBeforeDiscount - totalPrice;

    if (bulkDiscount > itemDiscount) {
      totalPrice = totalBeforeDiscount * (1 - 0.25);
      totalDiscountRate = 0.25;
    } else {
      totalDiscountRate = (totalBeforeDiscount - totalPrice) / totalBeforeDiscount;
    }
  } else {
    totalDiscountRate = (totalBeforeDiscount - totalPrice) / totalBeforeDiscount;
  }

  return { totalDiscountRate };
}

// 화요일 추가 할인 적용
function applyTuesdayDiscount(totalDiscountRate) {
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    totalDiscountRate = Math.max(totalDiscountRate, 0.1);
  }

  return { totalDiscountRate };
}

// 장바구니 총액을 화면에 표시
function renderCartTotal(totalDiscountRate) {
  $cartTotal.textContent = '총액: ' + Math.round(totalPrice) + '원';

  // 할인율이 있을 때 할인율을 추가로 표시
  if (totalDiscountRate > 0) {
    let $span = document.createElement('span');
    $span.className = 'text-green-500 ml-2';
    $span.textContent = '(' + (totalDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild($span);
  }
}

//장바구니 포인트 화면표시
function renderPoint() {
  point += Math.floor(totalPrice / 1000);
  let $point = document.getElementById('loyalty-points');
  if (!$point) {
    $point = document.createElement('span');
    $point.id = 'loyalty-points';
    $point.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($point);
  }
  $point.textContent = '(포인트: ' + point + ')';
}

//상품상태 표시
function renderStockStatus() {
  const infoMsg = productList
    .filter(item => item.count < 5) // 재고가 5개 미만인 상품만 필터링
    .map(item => {
      const status = item.count > 0 ? `재고 부족 (${item.count}개 남음)` : '품절';
      return `${item.name}: ${status}`;
    })
    .join('\n');

  $stockStatus.textContent = infoMsg;
}

//랜덤 할인 주기적으로 alert
function alertRandomDiscountWithDelay() {
  const delayTime = Math.random() * RANDOM_MAX_DELAY;
  setTimeout(() => {
    alertRandomDiscountWithInterval(productList);
  }, delayTime);
}

function alertRandomDiscountWithInterval(productList) {
  setInterval(() => {
    applyRandomDiscount(productList);
  }, RANDOM_DISCOUNT_INTERVAL);
}

function applyRandomDiscount(productList) {
  let randomProduct = productList[Math.floor(Math.random() * productList.length)];
  if (Math.random() < RANDOM_DISCOUNT_PROBABILITY && randomProduct.count > 0) {
    randomProduct.price = Math.round(randomProduct.price * 0.8);
    alert(
      '번개세일! ' + randomProduct.name + `이(가) ${RANDOM_DISCOUNT_PER * 100}% 할인 중입니다!`,
    );
    renderProductSelect();
  }
}

//할인 추천 주기적으로 alert
function alertRecommendDiscountWithDelay() {
  const delayTime = Math.random() * RECOMMEND_MAX_DELAY;
  setTimeout(() => {
    alertRecommendDiscountWithInterval(productList, lastSelectedId);
  }, delayTime);
}

function alertRecommendDiscountWithInterval(productList, lastSelectedId) {
  setInterval(() => {
    recommendDiscount(productList, lastSelectedId);
  }, RECOMMEND_DISCOUNT_INTERVAL);
}

function recommendDiscount(productList, lastSelectedId) {
  if (lastSelectedId) {
    let recommendProduct = productList.find(
      product => product.id !== lastSelectedId && product.count > 0,
    );

    if (recommendProduct) {
      alert(
        recommendProduct.name +
          `은(는) 어떠세요? 지금 구매하시면 ${ADDITIONAL_DISCOUNT_PER * 100}% 추가 할인!`,
      );
      recommendProduct.price = Math.round(recommendProduct.price * 0.95);
      renderProductSelect();
    }
  }
}

$productAddBtn.addEventListener('click', function () {
  var selItem = $productSelect.value;
  console.log('selTItem', selItem);
  var itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.count > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      console.log('newQty', newQty);
      if (newQty <= itemToAdd.count) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.count--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $cartItems.appendChild(newItem);
      itemToAdd.count--;
    }
    processCart();
    lastSelectedId = selItem;
  }
});

$cartItems.addEventListener('click', function (event) {
  console.log('eve', event);
  var tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.count + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.count -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.count -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.count += remQty;
      itemElem.remove();
    }
    processCart();
  }
});
