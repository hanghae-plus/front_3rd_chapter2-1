import {
  BULK_DISCOUNT_AMOUNT,
  DISCOUNT_RATE_BY_ID,
  EXTRA_DISCOUNT_RATE,
  LUCKY_DISCOUNT_RATE,
  PRODUCT_LIST,
  RANDOM_RATE_LIMIT,
  THIRTY_DISCOUNT_RATE,
  TUESDAY,
  TUESDAY_DISCOUNT_RATE,
} from './constant';
import {
  bonusPoints,
  lastAddedItem,
  setBonusPoints,
  setLastAddedItem,
} from './store';

export function updateSelectOptionStatus() {
  const $productSelectBox = document.getElementById('product-select');
  $productSelectBox.innerHTML = '';

  PRODUCT_LIST.forEach((product) => {
    const option = document.createElement('option');

    option.value = product.id;
    option.textContent = `${product.name} - ${product.val}원`;

    if (product.quantity === 0) option.disabled = true;

    $productSelectBox.appendChild(option);
  });
}

export function updateLastAddedItem() {
  const $productSelectBox = document.getElementById('product-select');
  const selectedItem = $productSelectBox.value;
  setLastAddedItem(selectedItem);
}

export function updateTotalPrice() {
  let quantityCount = 0;
  let totalPrice = 0;
  let beforeDiscountTotalPrice = 0;
  let discountRate = 0;

  const $cartItemList = document.getElementById('cart-items');
  const $cartItemChildren = $cartItemList.children;
  const $cartTotal = document.getElementById('cart-total');

  Array.from($cartItemChildren).forEach(($cartItem) => {
    const curProduct = PRODUCT_LIST.find((item) => item.id === $cartItem.id);
    const $quantityInfo = $cartItem.querySelector('span');
    const curAmount = parseInt($quantityInfo.textContent.split('x ')[1]);
    const itemTotalPrice = curProduct.val * curAmount;
    const discountRate =
      (curAmount >= 10 && DISCOUNT_RATE_BY_ID[curProduct.id]) ?? 0;

    quantityCount += curAmount;
    totalPrice += itemTotalPrice * (1 - discountRate);
    beforeDiscountTotalPrice += itemTotalPrice;
  });

  // 상품 종류 상관 없이, 30개 이상 구매 시 25% 할인
  if (beforeDiscountTotalPrice > 0) {
    discountRate =
      (beforeDiscountTotalPrice - totalPrice) / beforeDiscountTotalPrice;

    const bulkDiscount = totalPrice * THIRTY_DISCOUNT_RATE;
    const itemDiscount = beforeDiscountTotalPrice - totalPrice;

    if (quantityCount >= BULK_DISCOUNT_AMOUNT && bulkDiscount > itemDiscount) {
      totalPrice = beforeDiscountTotalPrice * (1 - THIRTY_DISCOUNT_RATE);
      discountRate = THIRTY_DISCOUNT_RATE;
    }
  }

  // 화요일 할인
  const isTuesday = new Date().getDay() === TUESDAY;
  if (isTuesday) {
    totalPrice *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  $cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (discountRate > 0) {
    const $discountInfo = document.createElement('span');
    $discountInfo.className = 'text-green-500 ml-2';
    $discountInfo.textContent =
      '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild($discountInfo);
  }

  updateStockInfo();
  renderBonusPoint(totalPrice);
}

function updateStockInfo() {
  const $stockInfo = document.getElementById('stock-status');

  const infoMessages = PRODUCT_LIST.filter((item) => item.quantity < 5).map(
    (item) => {
      const status =
        item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절';
      return `${item.name}: ${status}`;
    },
  );

  $stockInfo.textContent = infoMessages.join('\n');
}

function renderBonusPoint(totalPrice) {
  const $cartTotal = document.getElementById('cart-total');

  let $pointInfo = document.getElementById('loyalty-points');
  if (!$pointInfo) {
    $pointInfo = document.createElement('span');
    $pointInfo.id = 'loyalty-points';
    $pointInfo.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($pointInfo);
  }

  const points = Math.floor(totalPrice / 1000);
  setBonusPoints(points);
  $pointInfo.textContent = `(포인트: ${bonusPoints})`;
}

export function setLuckySaleEvent() {
  setTimeout(() => {
    setInterval(() => {
      const luckyRandomIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyRandomIdx];
      const isLuckyTime = Math.random() < RANDOM_RATE_LIMIT;

      if (isLuckyTime && luckyItem.quantity > 0) {
        luckyItem.val = Math.round(luckyItem.val * (1 - LUCKY_DISCOUNT_RATE));
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptionStatus();
      }
    }, 30000);
  }, Math.random() * 10000);
}

export function setExtraSaleEvent() {
  setTimeout(() => {
    setInterval(() => {
      if (!lastAddedItem) return;

      const product = PRODUCT_LIST.find(
        (item) => item.id !== lastAddedItem && item.quantity > 0,
      );
      if (!product) return;

      alert(`${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      product.val = Math.round(product.val * (1 - EXTRA_DISCOUNT_RATE));
      updateSelectOptionStatus();
    }, 60000);
  }, Math.random() * 20000);
}
