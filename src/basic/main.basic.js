// 전역 변수
let $select, $addButton, $cartItemList, $finalTotalAmount, $stockInfo;

let lastSelectedId,
  bonusPoint = 0,
  totalAmount = 0,
  cartItemCount = 0;

let productList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

// 상수
const DISCOUNT_DEFAULT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_MIN = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const SUGGEST_DISCOUNT_RATE = 0.95;
const POINT_RATE = 1000;

// 메인 함수
function main() {
  const $root = document.getElementById('app');
  const $container = document.createElement('div');
  const $wrap = document.createElement('div');
  const $cartTitle = document.createElement('h1');

  $cartItemList = document.createElement('div');
  $finalTotalAmount = document.createElement('div');
  $select = document.createElement('select');
  $addButton = document.createElement('button');
  $stockInfo = document.createElement('div');

  $cartItemList.id = 'cart-items';
  $finalTotalAmount.id = 'cart-total';
  $select.id = 'product-select';
  $addButton.id = 'add-to-cart';

  $stockInfo.id = 'stock-status';
  $container.className = 'bg-gray-100 p-8';
  $wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $cartTitle.className = 'text-2xl font-bold mb-4';
  $finalTotalAmount.className = 'text-xl font-bold my-4';
  $select.className = 'border rounded p-2 mr-2';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';

  $cartTitle.textContent = '장바구니';
  $addButton.textContent = '추가';

  updateSelOpts();

  $wrap.appendChild($cartTitle);
  $wrap.appendChild($cartItemList);
  $wrap.appendChild($finalTotalAmount);
  $wrap.appendChild($select);
  $wrap.appendChild($addButton);
  $wrap.appendChild($stockInfo);
  $container.appendChild($wrap);
  $root.appendChild($container);

  calcCart();
  setRandomDiscountEvents();
  setEventListener();
}

// event listener
function setEventListener() {
  $addButton.addEventListener('click', function () {
    let selItem = $select.value;
    let itemToAdd = productList.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      let item = document.getElementById(itemToAdd.id);

      if (item) {
        let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

        if (newQty <= itemToAdd.q) {
          item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
          itemToAdd.q--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        let newItem = document.createElement('div');

        newItem.id = itemToAdd.id;
        newItem.className = 'flex justify-between items-center mb-2';

        newItem.innerHTML =
          '<span>' +
          itemToAdd.name +
          ' - ' +
          itemToAdd.val +
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
        $cartItemList.appendChild(newItem);
        itemToAdd.q--;
      }

      calcCart();

      lastSelectedId = selItem;
    }
  });

  $cartItemList.addEventListener('click', function (event) {
    let tgt = event.target;

    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      let prodId = tgt.dataset.productId;
      let itemElem = document.getElementById(prodId);
      let prod = productList.find((p) => p.id === prodId);

      if (tgt.classList.contains('quantity-change')) {
        let qtyChange = parseInt(tgt.dataset.change);
        let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;

        if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;

          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.q -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
        prod.q += remQty;
        itemElem.remove();
      }

      calcCart();
    }
  });
}

// interval events
function setRandomDiscountEvents() {
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedId) {
        let suggest = productList.find(function (item) {
          return item.id !== lastSelectedId && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * SUGGEST_DISCOUNT_RATE);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// event handlers
function updateSelOpts() {
  $select.innerHTML = '';
  productList.forEach(function (item) {
    let opt = document.createElement('option');

    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';

    if (item.q === 0) opt.disabled = true;

    $select.appendChild(opt);
  });
}

function calcCart() {
  totalAmount = 0;
  cartItemCount = 0;

  let cartItems = $cartItemList.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let curItem;

    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }

    let q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    let itemTot = curItem.val * q;
    let disc = 0;

    cartItemCount += q;
    subTot += itemTot;

    if (q >= 10) {
      if (curItem.id === 'p1') disc = DISCOUNT_DEFAULT_RATES.p1;
      else if (curItem.id === 'p2') disc = DISCOUNT_DEFAULT_RATES.p2;
      else if (curItem.id === 'p3') disc = DISCOUNT_DEFAULT_RATES.p3;
      else if (curItem.id === 'p4') disc = DISCOUNT_DEFAULT_RATES.p4;
      else if (curItem.id === 'p5') disc = DISCOUNT_DEFAULT_RATES.p5;
    }

    totalAmount += itemTot * (1 - disc);
  }

  let discRate = 0;

  if (cartItemCount >= BULK_DISCOUNT_MIN) {
    let bulkDisc = totalAmount * BULK_DISCOUNT_RATE;
    let itemDisc = subTot - totalAmount;

    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - BULK_DISCOUNT_RATE);
      discRate = BULK_DISCOUNT_RATE;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, TUESDAY_DISCOUNT_RATE);
  }

  $finalTotalAmount.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $finalTotalAmount.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoint();
}

function renderBonusPoint() {
  bonusPoint += Math.floor(totalAmount / POINT_RATE);
  let ptsTag = document.getElementById('loyalty-points');

  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $finalTotalAmount.appendChild(ptsTag);
  }

  ptsTag.textContent = '(포인트: ' + bonusPoint + ')';
}

function updateStockInfo() {
  let infoMsg = '';

  productList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
    }
  });

  $stockInfo.textContent = infoMsg;
}

main();
