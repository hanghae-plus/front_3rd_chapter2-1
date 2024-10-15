const THIRTY_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const RANDOM_RATE_LIMIT = 0.3;
const LUCKY_DISCOUNT_RATE = 0.2;
const EXTRA_DISCOUNT_RATE = 0.05;
const DISCOUNT_RATE_BY_ID = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', val: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', val: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', val: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', val: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', val: 25000, quantity: 10 },
];

let bonusPoints = 0;
let lastAddedItem;

function main() {
  // 장바구니 페이지 렌더링
  renderShoppingCartPage();
  updateSelectOptionStatus();
  updateTotalPrice();

  // 이벤트 리스너 추가
  attatchEventListener();

  // 할인 특가 설정
  setLuckySaleEvent();
  setExtraSaleEvent();
}

function renderShoppingCartPage() {
  const $root = document.getElementById('app');
  const $cartWrapper = document.createElement('div');
  const $cartContainer = document.createElement('div');
  const $cartTitle = document.createElement('h1');
  const $cartItemList = document.createElement('div');
  const $cartTotal = document.createElement('div');
  const $productSelectBox = document.createElement('select');
  const $addToCartBtn = document.createElement('button');
  const $stockInfo = document.createElement('div');

  $cartItemList.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $productSelectBox.id = 'product-select';
  $addToCartBtn.id = 'add-to-cart';
  $stockInfo.id = 'stock-status';

  $cartWrapper.className = 'bg-gray-100 p-8';
  $cartContainer.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $cartTitle.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $productSelectBox.className = 'border rounded p-2 mr-2';
  $addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';

  $cartTitle.textContent = '장바구니';
  $addToCartBtn.textContent = '추가';

  $cartContainer.appendChild($cartTitle);
  $cartContainer.appendChild($cartItemList);
  $cartContainer.appendChild($cartTotal);
  $cartContainer.appendChild($productSelectBox);
  $cartContainer.appendChild($addToCartBtn);
  $cartContainer.appendChild($stockInfo);
  $cartWrapper.appendChild($cartContainer);
  $root.appendChild($cartWrapper);
}

function attatchEventListener() {
  const $addToCartBtn = document.getElementById('add-to-cart');
  const $cartItemList = document.getElementById('cart-items');

  $addToCartBtn.addEventListener('click', handleClickAddToCart);
  $cartItemList.addEventListener('click', (e) => handleClickCartItem(e));
}

function updateSelectOptionStatus() {
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

function updateLastAddedItem() {
  const $productSelectBox = document.getElementById('product-select');
  const selectedItem = $productSelectBox.value;
  lastAddedItem = selectedItem;
}

function updateTotalPrice() {
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

    if (quantityCount >= 30 && bulkDiscount > itemDiscount) {
      totalPrice = beforeDiscountTotalPrice * (1 - THIRTY_DISCOUNT_RATE);
      discountRate = THIRTY_DISCOUNT_RATE;
    }
  }

  // 화요일 할인
  const isTuesday = new Date().getDay() === 2;
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
    }
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

  bonusPoints += Math.floor(totalPrice / 1000);
  $pointInfo.textContent = `(포인트: ${bonusPoints})`;
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

function setLuckySaleEvent() {
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

function setExtraSaleEvent() {
  setTimeout(() => {
    setInterval(() => {
      if (!lastAddedItem) return;

      const product = PRODUCT_LIST.find(
        (item) => item.id !== lastAddedItem && item.quantity > 0
      );
      if (!product) return;

      alert(`${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      product.val = Math.round(product.val * (1 - EXTRA_DISCOUNT_RATE));
      updateSelectOptionStatus();
    }, 60000);
  }, Math.random() * 20000);
}

main();
