const BULK_DISCOUNT_RATE = 0.25; // 25%의 대량 할인율
const BULK_MIN_COUNT = 30; // 대량 할인을 받기 위한 최소 품목 수
const WEEKDAY_DISCOUNT_RATE = 0.1; // 수요일 할인율

let $wrapperDiv, $containerDiv, $cartItemDiv, $cartTotalDiv, $stockStatusDiv;
let $pageTitleH1, $productSelector, $addCartButton;
let productList, lastStockItem;

let bonusPoint = 0;
let totalAmount = 0;
let itemCount = 0;

const createSelectOption = (item) => {
  let optionValue = item.id;
  let textContent = `${item.name} - ${item.price}원`;
  let $option = createElement("option", { value: optionValue, textContent: textContent });

  if (item.quantity === 0) {
    $option.disabled = true;
  }

  return $option;
};

const calculateDiscountRate = (cartTotalPrice) => {
  let discountRate = 0;

  if (itemCount >= BULK_MIN_COUNT) {
    let bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    let itemDiscount = cartTotalPrice - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = cartTotalPrice * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  } else {
    discountRate = (cartTotalPrice - totalAmount) / cartTotalPrice;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - WEEKDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, WEEKDAY_DISCOUNT_RATE);
  }

  return discountRate;
};

// 재고정보 메세지 생성
const createStockMessage = (lowStockItems) => {
  let infoMessage = "";

  lowStockItems.forEach((item) => {
    let quantity = item.quantity;
    infoMessage += `${item.name}: ${quantity > 0 ? `재고 부족 (${quantity} 개 남음)` : "품절"}\n`;
  });

  return infoMessage;
};

// 재고 업데이트
const decreaseProductQuantity = (selectedProduct, quantityChange) => {
  selectedProduct.quantity -= quantityChange; // 재고 차감
};

const restoreProductQuantity = (selectedProduct, currentQuantity) => {
  selectedProduct.quantity += currentQuantity; // 기존 수량만큼 재고 복구
};

// 카트에 추가된 상품 제거
const removeCartItem = (selectedProduct, currentQuantity) => {
  const removeItem = document.getElementById(selectedProduct.id);
  restoreProductQuantity(selectedProduct, currentQuantity);
  removeItem.remove();
};

// 카트에 추가된 상품 업데이트
const updateCartItem = (selectedProduct, quantityChange = 1) => {
  const $cartItemElement = document.getElementById(selectedProduct.id);
  const currentCartItemTextContent = $cartItemElement.querySelector("span").textContent;
  const currentCartItemInfo = currentCartItemTextContent.split("x ")[0];
  const currentQuantity = parseInt(currentCartItemTextContent.split("x ")[1]);

  let newQuantity = currentQuantity + quantityChange;

  // 수량이 유효할 경우 업데이트
  const isValidQuantity = newQuantity > 0 && newQuantity <= selectedProduct.quantity + currentQuantity;

  if (isValidQuantity) {
    $cartItemElement.querySelector("span").textContent = `${currentCartItemInfo}x ${newQuantity}`;
    decreaseProductQuantity(selectedProduct, quantityChange);
    return;
  }

  // 재고없음!
  const isOutOfStock = newQuantity <= 0;
  if (isOutOfStock) {
    removeCartItem(selectedProduct, currentQuantity);
    return;
  }

  alert("재고가 부족합니다.");
};

// 카트에 상품 추가
const newCartItem = (selectedProduct) => {
  let newItem = createElement("div", { id: `${selectedProduct.id}`, className: "flex justify-between items-center mb-2" });

  const html = `
    <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1"> - </button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1"> + </button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
    </div>
  `;

  newItem.innerHTML = html;
  $cartItemDiv.appendChild(newItem);
  selectedProduct.quantity--;
};

function main() {
  productList = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ];

  renderUI();
  updateSelOpts();
  calcCart();
  notifySaleMessage();
}

const createElement = (type, attributes) => {
  const $element = document.createElement(type);

  for (const key in attributes) {
    $element[key] = attributes[key];
  }

  return $element;
};

function renderUI() {
  const $root = document.getElementById("app");

  $wrapperDiv = createElement("div", { className: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8" });
  $containerDiv = createElement("div", { className: "bg-gray-100 p-8" });
  $pageTitleH1 = createElement("h1", { className: "text-2xl font-bold mb-4", textContent: "장바구니" });
  $cartItemDiv = createElement("div", { id: "cart-items" });

  $cartTotalDiv = createElement("div", { className: "text-xl font-bold my-4", id: "cart-total" });
  $productSelector = createElement("select", { className: "border rounded p-2 mr-2", id: "product-select" });
  $addCartButton = createElement("button", { className: "bg-blue-500 text-white px-4 py-2 rounded", id: "add-to-cart", textContent: "추가" });
  $stockStatusDiv = createElement("div", { className: "text-sm text-gray-500 mt-2", id: "stock-status" });

  $wrapperDiv.appendChild($pageTitleH1);
  $wrapperDiv.appendChild($cartItemDiv);
  $wrapperDiv.appendChild($cartTotalDiv);
  $wrapperDiv.appendChild($productSelector);
  $wrapperDiv.appendChild($addCartButton);
  $wrapperDiv.appendChild($stockStatusDiv);

  $containerDiv.appendChild($wrapperDiv);
  $root.appendChild($containerDiv);
}

// 포인트 view
function renderbonusPoint() {
  let $pointTag = document.getElementById("loyalty-points");
  bonusPoint += Math.floor(totalAmount / 1000);

  if (!$pointTag) {
    $pointTag = createElement("span", { className: "text-blue-500 ml-2", id: "loyalty-points" });
    $cartTotalDiv.appendChild($pointTag);
  }

  $pointTag.textContent = `(포인트: ${bonusPoint})`;
}

// 재고정보 메세지 Dom 업데이트
function updateStockInfo() {
  const lowStockItems = productList.filter((item) => item.quantity < 5);
  let stockMessage = createStockMessage(lowStockItems);

  $stockStatusDiv.textContent = stockMessage;
}

// 번개할인 알림
const notifyFlashSale = () => {
  setTimeout(() => {
    setInterval(() => {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");

        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);
};

// 제안 할인 알림
const notifySuggestedSale = () => {
  setTimeout(() => {
    setInterval(() => {
      if (lastStockItem) {
        let suggest = productList.find((item) => item.id !== lastStockItem && item.quantity > 0);

        if (suggest) {
          alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 할인 알림
const notifySaleMessage = () => {
  notifyFlashSale();
  notifySuggestedSale();
};

// 셀렉트 option render
const updateSelOpts = () => {
  $productSelector.innerHTML = "";

  productList.forEach(function (item) {
    let options = createSelectOption(item);

    return $productSelector.appendChild(options);
  });
};

// 최종 가격, 수량 계산
function calcTotalAmount() {
  const discountMenual = [
    { currentItemId: "p1", discountRate: 0.1 },
    { currentItemId: "p2", discountRate: 0.15 },
    { currentItemId: "p3", discountRate: 0.2 },
    { currentItemId: "p4", discountRate: 0.05 },
    { currentItemId: "p5", discountRate: 0.25 },
  ];

  const $cartItems = $cartItemDiv.children;
  let cartTotalPrice = 0;

  totalAmount = 0;
  itemCount = 0;

  for (let i = 0; i < $cartItems.length; i++) {
    let currenProductId = productList.find((item) => item.id === $cartItems[i].id);
    let quantity = parseInt($cartItems[i].querySelector("span").textContent.split("x ")[1]);
    let itemTot = currenProductId.price * quantity;
    let discountRate = 0;

    itemCount += quantity;
    cartTotalPrice += itemTot;

    if (quantity >= 10) {
      const discountItem = discountMenual.find((item) => item.currentItemId === currenProductId.id);
      discountRate = discountItem.discountRate;
    }

    totalAmount += itemTot * (1 - discountRate);
  }

  return { cartTotalPrice, totalAmount };
}

// 쇼핑 카트 카드 최종가, 할인, 포인트 계산 및 view
function calcCart() {
  let { cartTotalPrice, totalAmount } = calcTotalAmount();
  let discountRate = calculateDiscountRate(cartTotalPrice);

  $cartTotalDiv.textContent = "총액: " + Math.round(totalAmount) + "원";

  if (discountRate > 0) {
    let $discountRateSpan = createElement("span", { className: "text-green-500 ml-2", textContent: "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)" });
    $cartTotalDiv.appendChild($discountRateSpan);
  }

  updateStockInfo();
  renderbonusPoint();
}

main();

$addCartButton.addEventListener("click", function () {
  let selectedCartItem = $productSelector.value;
  let selectedProduct = productList.find((item) => item.id === selectedCartItem);

  if (selectedProduct && selectedProduct.quantity <= 0) {
    return;
  }

  let $item = document.getElementById(selectedProduct.id);

  if ($item) {
    updateCartItem(selectedProduct);
  } else {
    newCartItem(selectedProduct);
  }

  calcCart();
  lastStockItem = selectedCartItem;
});

$cartItemDiv.addEventListener("click", function (event) {
  const $eventTarget = event.target;
  const $isQuantityChangeButton = $eventTarget.classList.contains("quantity-change");
  const $isRemoveButton = $eventTarget.classList.contains("remove-item");

  if ($isQuantityChangeButton || $isRemoveButton) {
    const selectedProdutId = $eventTarget.dataset.productId;
    const $itemElem = document.getElementById(selectedProdutId);
    const cartItemsTextContent = $itemElem.querySelector("span").textContent;
    const currentQuantity = parseInt(cartItemsTextContent.split("x ")[1]);
    const quantityChange = parseInt($eventTarget.dataset.change);

    let selectedProduct = productList.find((p) => p.id === selectedProdutId);

    // +,-
    if ($isQuantityChangeButton) {
      updateCartItem(selectedProduct, quantityChange);
    }

    // 삭제
    if ($isRemoveButton) {
      removeCartItem(selectedProduct, currentQuantity);
    }

    calcCart();
  }
});
