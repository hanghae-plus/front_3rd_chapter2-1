import { discountPrice, getRandomItem, probability, sleep } from './utils';
import {
  LUCKY_DRAW_DELAY,
  LOYALTY_POINT_PERCENTAGE,
  LUCKY_DRAW_INTERVAL,
  LUCKY_DRAW_PERCENTAGE,
  LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE,
  SUGGESTED_PRODUCT_DELAY,
  SUGGESTED_PRODUCT_INTERVAL,
  SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE,
  BULK_PURCHASE_DISCOUNT_PERCENTAGE,
  BULK_PURCHASE_DISCOUNT_MIN_COUNT,
  BULK_PURCHASE_DISCOUNT_MIN_COUNT_PER_PRODUCT,
  TUESDAY_DISCOUNT_PERCENTAGE,
} from './constants';

let $productSelect;
let $addButton;
let $cartItems;
let $cartTotal;
let $stockStatus;

let recentlyAddedProductId = null;
let loyaltyPoints = 0;
let cartTotalPrice = 0;
let cartTotalCount = 0;

const productList = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50, bulkDiscountPercentage: 10 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30, bulkDiscountPercentage: 15 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20, bulkDiscountPercentage: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0, bulkDiscountPercentage: 5 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10, bulkDiscountPercentage: 25 },
];

// Utils
function discountProduct(product, percentage, round = false) {
  const discountedPrice = discountPrice(product.price, percentage);
  product.price = round ? Math.round(discountedPrice) : discountedPrice;

  return product;
}

function randomDelay(delay = 1) {
  return sleep(Math.random() * delay);
}

/**
 * 상품 선택 셀렉트박스를 렌더링
 */
function renderProductSelect(productList) {
  $productSelect.innerHTML = '';

  productList.forEach((product) => {
    const opt = document.createElement('option');

    opt.value = product.id;
    opt.textContent = `${product.name} - ${product.price}원`;

    // 재고가 없을 경우 비활성화
    if (product.stock === 0) opt.disabled = true;

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

function renderStockStatus(productList) {
  $stockStatus.textContent = productList
    .filter(({ stock }) => stock < 5)
    .map(({ stock, name }) => {
      return `${name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : '품절'}`;
    })
    .join('\n');
}

function renderCartTotal(price, discountRate) {
  $cartTotal.textContent = `총액: ${Math.round(price)}원`;

  // 할인 텍스트 렌더링
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    $cartTotal.appendChild(span);
  }
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
  cartTotalPrice = 0;
  cartTotalCount = 0;

  // bulkDiscount가 적용되지 않은 장바구니 상품 금액 합계
  let subTotalPrice = 0;

  // 장바구니 상품 마다 장바구니에 추가된 개수, 총 금액을 계산
  // itemCount, totalPrice에 더해주는 로직
  Array.from($cartItems.children).forEach(($cartItem) => {
    const targetProduct = productList.find((p) => p.id === $cartItem.id);
    const itemCount = parseInt($cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemPrice = targetProduct.price * itemCount;

    cartTotalCount += itemCount;
    subTotalPrice += itemPrice;

    if (itemCount >= BULK_PURCHASE_DISCOUNT_MIN_COUNT_PER_PRODUCT) {
      cartTotalPrice += discountPrice(itemPrice, targetProduct.bulkDiscountPercentage);
    } else {
      cartTotalPrice += itemPrice;
    }
  });

  let discountRate = 0;

  // 장바구니에 담긴 상품 개수가 30개 이상이면
  const isCanBulkDiscount = cartTotalCount >= BULK_PURCHASE_DISCOUNT_MIN_COUNT;
  if (isCanBulkDiscount) {
    // 대량 구매 할인
    const bulkDiscountedPrice = discountPrice(cartTotalPrice, BULK_PURCHASE_DISCOUNT_PERCENTAGE);

    // 상품 개별 할인이 적용되어서 할인 받을 수 있는 금액 = 상품 개별 할인(개별 상품 10개 이상 구매)이 적용된 장바구니 금액 합계 - 할인이 적용되지 않은 금액 합계
    // (대량 상품 구매에 따라서 일괄 적용되는 할인된 금액) > (상품 개별 할인이 적용되어서 할인 받을 수 있는 금액)
    if (bulkDiscountedPrice > subTotalPrice - cartTotalPrice) {
      discountRate = BULK_PURCHASE_DISCOUNT_PERCENTAGE / 100;
      cartTotalPrice = discountPrice(subTotalPrice, BULK_PURCHASE_DISCOUNT_PERCENTAGE);
    } else {
      discountRate = (subTotalPrice - cartTotalPrice) / subTotalPrice;
    }
  } else {
    discountRate = (subTotalPrice - cartTotalPrice) / subTotalPrice;
  }

  // 화요일 특별 할인 최소 10% 적용
  const isTuesDay = new Date().getDay() === 2;
  if (isTuesDay) {
    cartTotalPrice = discountPrice(cartTotalPrice, TUESDAY_DISCOUNT_PERCENTAGE);
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_PERCENTAGE / 100);
  }

  renderCartTotal(cartTotalPrice, discountRate);

  renderStockStatus(productList);

  // 장바구니에 담긴 상품 금액을 기준으로 포인트 업데이트
  const newLoyaltyPoints = calcLoyaltyPoints(loyaltyPoints, cartTotalPrice);
  renderLoyaltyPoints(newLoyaltyPoints);
  loyaltyPoints = newLoyaltyPoints;
}

// Lucky Draw 이벤트를 시작합니다.
function startLuckyDrawInterval() {
  setInterval(() => {
    const isCanLuckyDraw = probability(LUCKY_DRAW_PERCENTAGE);
    if (isCanLuckyDraw) {
      const luckyProduct = getRandomItem(productList);

      if (luckyProduct.stock > 0) {
        discountProduct(luckyProduct, LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE);

        alert(`번개세일! ${luckyProduct.name}이(가) ${LUCKY_DRAW_PRODUCT_DISCOUNT_PERCENTAGE}% 할인 중입니다!`);

        renderProductSelect(productList);
      }
    }
  }, LUCKY_DRAW_INTERVAL);
}

// 상품 추천 이벤트를 시작합니다.
function startSuggestedProductInterval() {
  // 장바구니에 마지막으로 추가된 상품을 제외하고, 무작위로 상품을 하나 선택해서 5% 할인을 적용
  setInterval(() => {
    // 장바구니에 최근 추가된 상품이 없을 경우 상품 추천을 하지 않습니다
    if (recentlyAddedProductId === null) {
      return;
    }

    // 장바구니에 최근 추가된 상품은 추첨 대상에서 제외됩니다.
    const suggestedProduct = productList.find((item) => {
      return item.id !== recentlyAddedProductId && item.stock > 0;
    });

    if (suggestedProduct) {
      alert(
        `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE}% 추가 할인!`,
      );

      discountProduct(suggestedProduct, SUGGESTED_PRODUCT_DISCOUNT_PERCENTAGE);

      renderProductSelect(productList);
    }
  }, SUGGESTED_PRODUCT_INTERVAL);
}

function main() {
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
    const addCartItem = (product, count = 1) => {
      const $el = document.createElement('div');
      $el.id = product.id;
      $el.className = 'flex justify-between items-center mb-2';

      $el.innerHTML =
        `<span>${product.name} - ${product.price}원 x ${count}</span><div>` +
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
    const updateCartItem = (product, count = 1) => {
      const $cartItem = document.getElementById(product.id);
      $cartItem.querySelector('span').textContent = `${product.name} - ${product.price}원 x ${count}`;
    };

    // 현재 선택된 상품
    const selectedProductId = $productSelect.value;
    const productToAdd = productList.find((p) => p.id === selectedProductId);

    if (!productToAdd || productToAdd.stock === 0) {
      return;
    }

    // 마지막에 장바구니에 담은 상품 저장
    recentlyAddedProductId = productToAdd.id;

    // 장바구니에 상품이 추가되어 있을 경우 업데이트
    const $cartItem = document.getElementById(productToAdd.id);
    if ($cartItem) {
      const newCount = parseInt($cartItem.querySelector('span').textContent.split('x ')[1], 10) + 1;
      if (newCount > productToAdd.stock) {
        alert('재고가 부족합니다.');
        return;
      }

      updateCartItem(productToAdd, newCount);
      productToAdd.stock -= 1;
    } else {
      // 장바구니에 상품을 새로 추가할 경우
      addCartItem(productToAdd);
      productToAdd.stock -= 1;
    }

    calcCart();
  });

  $cartItems.addEventListener('click', (event) => {
    const { target } = event;

    // 수량 변경 버튼 또는 삭제 버튼
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const { productId } = target.dataset;
      const $item = document.getElementById(productId);
      const targetProduct = productList.find((product) => product.id === productId);
      const [title, count] = $item.querySelector('span').textContent.split('x ');
      const currentCount = parseInt(count);

      // 수량 변경 로직
      if (target.classList.contains('quantity-change')) {
        const qtyChange = parseInt(target.dataset.change);
        const newCount = currentCount + qtyChange;

        if (newCount > 0 && newCount <= targetProduct.stock + currentCount) {
          // 장바구니에 담긴 상품 개수 업데이트
          $item.querySelector('span').textContent = `${title}x ${newCount}`;
          targetProduct.stock -= qtyChange;
        } else if (newCount <= 0) {
          // 장바구니에서 상품 삭제
          $item.remove();
          targetProduct.stock += Math.abs(qtyChange);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        // 장바구니에서 상품 삭제
        targetProduct.stock += currentCount;
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

  renderProductSelect(productList);
  calcCart();

  randomDelay(LUCKY_DRAW_DELAY).then(() => {
    startLuckyDrawInterval();
  });

  randomDelay(SUGGESTED_PRODUCT_DELAY).then(() => {
    startSuggestedProductInterval();
  });
}

main();
