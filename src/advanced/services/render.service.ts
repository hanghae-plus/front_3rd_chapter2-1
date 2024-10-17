import { Product, PRODUCT_LIST } from '../__tests__/productData';

const TUESDAY = 2;
const BULK_DISCOUNT_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const DISCOUNT_RATE_BY_ID: { [key: string]: number } = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
export let bonusPoints = 0;
export let lastAddedItem: string;

export function setBonusPoints(point: number): void {
  bonusPoints += point;
}

export function setLastAddedItem(item: string): void {
  lastAddedItem = item;
}

export function updateSelectOptionStatus() {
  const $productSelectBox = document.getElementById('product-select');
  if ($productSelectBox) {
    $productSelectBox.innerHTML = '';
  }

  PRODUCT_LIST.forEach((product) => {
    const option = document.createElement('option');

    option.value = product.id;
    option.textContent = `${product.name} - ${product.val}원`;

    if (product.quantity === 0) option.disabled = true;

    $productSelectBox?.appendChild(option);
  });
}

export function updateLastAddedItem() {
  const $productSelectBox = document.getElementById(
    'product-select',
  ) as HTMLInputElement;
  const selectedItem = $productSelectBox.value;
  setLastAddedItem(selectedItem);
}

export function updateTotalPrice() {
  let quantityCount = 0;
  let totalPrice = 0;
  let beforeDiscountTotalPrice = 0;
  let discountRate = 0;

  const $cartItemList = document.getElementById('cart-items')!;
  const $cartItemChildren = $cartItemList.children!;
  const $cartTotal = document.getElementById('cart-total')!;

  Array.from($cartItemChildren).forEach(($cartItem) => {
    const curProduct = PRODUCT_LIST.find((item) => item.id === $cartItem.id);
    const $quantityInfo = $cartItem.querySelector('span');

    if (!curProduct || !$quantityInfo || !$quantityInfo.textContent) return;

    const curAmount = parseInt($quantityInfo.textContent.split('x ')[1]);
    const itemTotalPrice = curProduct.val * curAmount;
    const discountRate =
      (curAmount >= 10 && DISCOUNT_RATE_BY_ID[curProduct.id]) || 0;

    quantityCount += curAmount;
    totalPrice += itemTotalPrice * (1 - discountRate);
    beforeDiscountTotalPrice += itemTotalPrice;
  });

  // 상품 종류 상관 없이, 30개 이상 구매 시 25% 할인
  if (beforeDiscountTotalPrice > 0) {
    discountRate =
      (beforeDiscountTotalPrice - totalPrice) / beforeDiscountTotalPrice;

    const bulkDiscount = totalPrice * BULK_DISCOUNT_RATE;
    const itemDiscount = beforeDiscountTotalPrice - totalPrice;

    if (quantityCount >= BULK_DISCOUNT_AMOUNT && bulkDiscount > itemDiscount) {
      totalPrice = beforeDiscountTotalPrice * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
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

  const infoMessages = PRODUCT_LIST.filter(
    (item: Product) => item.quantity < 5,
  ).map((item: Product) => {
    const status =
      item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절';
    return `${item.name}: ${status}`;
  });

  if (!$stockInfo) return;

  $stockInfo.textContent = infoMessages.join('\n');
}

function renderBonusPoint(totalPrice: number) {
  const $cartTotal = document.getElementById('cart-total');

  let $pointInfo = document.getElementById('loyalty-points');
  if (!$pointInfo) {
    $pointInfo = document.createElement('span');
    $pointInfo.id = 'loyalty-points';
    $pointInfo.className = 'text-blue-500 ml-2';
    $cartTotal?.appendChild($pointInfo);
  }

  const points = Math.floor(totalPrice / 1000);
  setBonusPoints(points);
  $pointInfo.textContent = `(포인트: ${bonusPoints})`;
}
