const TUESDAY = 2;
const TUESDAY_DISCOUNT = 0.1;
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const LOYALTY_POINTS_THRESHOLD = 1000;
const LUCKY_SALE_RATE = 0.8; // 20% 할인
const LUCKY_SALE_PROBABILITY = 0.3;
const SUGGESTED_SALE_RATE = 0.95; // 5% 할인

const QUANTITY_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p5: 0.25,
};

// 상태 관리 객체
const cartState = {
  productList: [],
  lastSelectedProduct: null,
  bonusPoints: 0,
  totalAmount: 0,
  itemCount: 0,
  cartItems: [],
};

// DOM 엘리먼트 상태
let productSelect,
  addToCartButton,
  cartDisplay,
  totalAmountDisplay,
  stockStatusDisplay;

const createElementWithClass = (tag, className = "", id = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (id) element.id = id;
  return element;
};

// DOM Element 초기화
const initDom = () => {
  const root = document.getElementById("app");
  const container = createElementWithClass("div", "bg-gray-100 p-8");
  const wrapper = createElementWithClass(
    "div",
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
  );
  const headerText = createElementWithClass("h1", "text-2xl font-bold mb-4");
  headerText.textContent = "장바구니";
  cartDisplay = createElementWithClass("div", "", "cart-items");
  totalAmountDisplay = createElementWithClass(
    "div",
    "text-xl font-bold my-4",
    "cart-total"
  );
  productSelect = createElementWithClass(
    "select",
    "border rounded p-2 mr-2",
    "product-select"
  );
  addToCartButton = createElementWithClass(
    "button",
    "bg-blue-500 text-white px-4 py-2 rounded",
    "add-to-cart"
  );
  stockStatusDisplay = createElementWithClass(
    "div",
    "text-sm text-gray-500 mt-2",
    "stock-status"
  );

  addToCartButton.textContent = "추가";
  updateProductSelectOptions();

  wrapper.append(
    headerText,
    cartDisplay,
    totalAmountDisplay,
    productSelect,
    addToCartButton,
    stockStatusDisplay
  );
  container.appendChild(wrapper);
  root.appendChild(container);
};

// 상품 Select 옵션 업데이트
const updateProductSelectOptions = () => {
  productSelect.innerHTML = "";
  cartState.productList.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${item.price}원`;
    if (item.quantity === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
};

// 장바구니의 총액을 계산
const calculateCartTotal = () => {
  cartState.totalAmount = 0;
  cartState.itemCount = 0;
  const cartItems = cartDisplay.children;
  let subtotal = 0;
  let discRate = 0;

  Array.from(cartItems).forEach((cartItem) => {
    const product = cartState.productList.find((p) => p.id === cartItem.id);
    const quantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1]
    );
    const itemTotal = product.price * quantity;
    subtotal += itemTotal;
    cartState.totalAmount +=
      itemTotal * (1 - calculateDiscount(product, quantity));
    cartState.itemCount += quantity;
  });

  applyBulkDiscount(subtotal);
  applyTuesdayDiscount();

  // 할인율 계산 (할인율을 반영한 가격)
  discRate = (subtotal - cartState.totalAmount) / subtotal;
  displayTotalAmount(discRate);

  updateStockStatusDisplay();
  renderBonusPoints();
};

// 대량 구매 할인 적용
const applyBulkDiscount = (subtotal) => {
  if (cartState.itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subtotal * BULK_DISCOUNT_RATE;
    cartState.totalAmount = Math.min(
      cartState.totalAmount,
      subtotal - bulkDiscount
    );
  }
};

// 화요일 할인 적용
const applyTuesdayDiscount = () => {
  if (new Date().getDay() === TUESDAY) {
    cartState.totalAmount *= 1 - TUESDAY_DISCOUNT;
  }
};

// 총액 표시
const displayTotalAmount = (discRate = 0) => {
  totalAmountDisplay.textContent = `총액: ${Math.round(
    cartState.totalAmount
  )}원`;
  if (discRate > 0) {
    const discountSpan = document.createElement("span");
    discountSpan.className = "text-green-500 ml-2";
    discountSpan.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
    totalAmountDisplay.appendChild(discountSpan);
  }
};

// 보너스 포인트 계산 및 표시
const renderBonusPoints = () => {
  cartState.bonusPoints += Math.floor(
    cartState.totalAmount / LOYALTY_POINTS_THRESHOLD
  ); // 1,000원당 포인트 추가

  let pointTag = document.getElementById("loyalty-points");
  if (!pointTag) {
    pointTag = document.createElement("span");
    pointTag.id = "loyalty-points";
    pointTag.className = "text-blue-500 ml-2";
    totalAmountDisplay.appendChild(pointTag);
  }
  pointTag.textContent = "(포인트: " + cartState.bonusPoints + ")";
};

// 재고 상태 업데이트
const updateStockStatusDisplay = () => {
  let infoMsg = "";
  cartState.productList.forEach((item) => {
    if (item.quantity < 5) {
      infoMsg += `${item.name}: ${
        item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음)" : "품절"
      }\n`;
    }
  });
  stockStatusDisplay.textContent = infoMsg;
};

// 할인율 계산
const calculateDiscount = (product, quantity) => {
  if (quantity >= 10) {
    return QUANTITY_DISCOUNTS[product.id] || 0;
  }
  return 0;
};

// 번개 세일 처리 (랜덤으로 20% 할인)
const handleLuckySale = () => {
  const luckyItem =
    cartState.productList[
      Math.floor(Math.random() * cartState.productList.length)
    ];
  if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * LUCKY_SALE_RATE); // 20% 할인
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductSelectOptions(); // 상품 옵션 업데이트
  }
};

// 추천 세일 처리 (마지막 선택 상품과 다른 상품을 5% 할인)
const handleSuggestedSale = () => {
  if (cartState.lastSelectedProduct) {
    const suggestedItem = cartState.productList.find(
      (item) => item.id !== cartState.lastSelectedProduct && item.quantity > 0
    );
    if (suggestedItem) {
      suggestedItem.price = Math.round(
        suggestedItem.price * SUGGESTED_SALE_RATE
      ); // 5% 할인
      alert(
        `${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );
      updateProductSelectOptions(); // 상품 옵션 업데이트
    }
  }
};

const main = () => {
  // 상품 목록 초기화
  cartState.productList = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ];

  initDom();
  calculateCartTotal();
  // 번개 세일 및 추천 세일 타이머 설정
  setInterval(handleLuckySale, 30000);
  setInterval(handleSuggestedSale, 60000);
};

main();

addToCartButton.addEventListener("click", () => {
  const selectedProduct = productSelect.value;
  const productToAdd = cartState.productList.find(
    (p) => p.id === selectedProduct
  );

  if (productToAdd && productToAdd.quantity > 0) {
    let item = document.getElementById(productToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= productToAdd.quantity) {
        item.querySelector(
          "span"
        ).textContent = `${productToAdd.name} - ${productToAdd.price}원 x ${newQty}`;
        productToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = productToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML = `<span>${productToAdd.name} - ${productToAdd.price}원 x 1</span>
            <div>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="-1">-</button>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="1">+</button>
              <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${productToAdd.id}">삭제</button>
            </div>`;
      cartDisplay.appendChild(newItem);
      productToAdd.quantity--;
    }
    calculateCartTotal();
    cartState.lastSelectedProduct = selectedProduct;
  }
});

cartDisplay.addEventListener("click", (event) => {
  const target = event.target;

  // 수량 변경 또는 삭제 이벤트 처리
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const productId = target.dataset.productId;
    const itemElem = document.getElementById(productId);
    const product = cartState.productList.find((p) => p.id === productId);

    if (target.classList.contains("quantity-change")) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1]
      );
      const newQty = currentQty + quantityChange;

      // 수량 증가 또는 감소 처리
      if (newQty > 0 && newQty <= product.quantity + currentQty) {
        itemElem.querySelector(
          "span"
        ).textContent = `${product.name} - ${product.price}원 x ${newQty}`;
        product.quantity -= quantityChange;
      } else if (newQty <= 0) {
        // 수량이 0 이하일 경우 항목 삭제
        itemElem.remove();
        product.quantity += currentQty;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      // 상품 삭제 처리
      const currentQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1]
      );
      product.quantity += currentQty;
      itemElem.remove();
    }

    // 장바구니 총액 재계산
    calculateCartTotal();
  }
});
