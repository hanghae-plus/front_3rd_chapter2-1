// 상수 정의
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const POINTS_PER_1000_WON = 1;
const FLASH_SALE_INTERVAL = 30000;
const FLASH_SALE_DISCOUNT = 0.2;
const FLASH_SALE_PROBABILITY = 0.3;
const SUGGESTION_INTERVAL = 60000;
const SUGGESTION_DISCOUNT = 0.05;

// 쇼핑몰 모듈
const ShoppingApp = (function () {
  let productList,
    cartDisplay,
    sumDisplay,
    productSelect,
    addButton,
    stockInfoDisplay;
  let lastSelectedProduct,
    bonusPoints = 0,
    totalAmount = 0,
    itemCount = 0;

  // 초기 상품 목록
  const initialProducts = [
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ];

  //초기 상품 목록을 설정하고 이벤트 리스너를 설정
  function init() {
    productList = [...initialProducts];
    setupDOM();
    setupEventListeners();
    updateProductOptions();
    calculateCart();
    startPromotions();
  }

  // DOM 요소를 생성및 초기화
  function setupDOM() {
    const root = document.getElementById("app");
    const container = createElementWithClass("div", "bg-gray-100 p-8");
    const wrapper = createElementWithClass(
      "div",
      "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
    );

    const title = createElementWithClass("h1", "text-2xl font-bold mb-4");
    title.textContent = "장바구니";

    cartDisplay = createElementWithClass("div", "");
    cartDisplay.id = "cart-items";

    sumDisplay = createElementWithClass("div", "text-xl font-bold my-4");
    sumDisplay.id = "cart-total";

    productSelect = createElementWithClass("select", "border rounded p-2 mr-2");
    productSelect.id = "product-select";

    addButton = createElementWithClass(
      "button",
      "bg-blue-500 text-white px-4 py-2 rounded"
    );
    addButton.id = "add-to-cart";
    addButton.textContent = "추가";

    stockInfoDisplay = createElementWithClass(
      "div",
      "text-sm text-gray-500 mt-2"
    );
    stockInfoDisplay.id = "stock-status";

    wrapper.append(
      title,
      cartDisplay,
      sumDisplay,
      productSelect,
      addButton,
      stockInfoDisplay
    );
    container.appendChild(wrapper);
    root.appendChild(container);
  }

  function setupEventListeners() {
    addButton.addEventListener("click", handleAddToCart);
    cartDisplay.addEventListener("click", handleCartAction);
  }

  function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  function updateProductOptions() {
    productSelect.innerHTML = "";
    productList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} - ${item.value}원`;
      option.disabled = item.quantity === 0;
      productSelect.appendChild(option);
    });
  }

  //장바구니 총액계산
  function calculateCart() {
    let subtotal = 0;
    itemCount = 0;
    totalAmount = 0;

    Array.from(cartDisplay.children).forEach((cartItem) => {
      const [productId, quantity] = getCartItemInfo(cartItem);
      const product = findProductById(productId);
      const itemTotal = product.value * quantity;

      itemCount += quantity;
      subtotal += itemTotal;

      const discount = calculateItemDiscount(product, quantity);
      totalAmount += itemTotal * (1 - discount);
    });

    // 대량 구매 할인 적용
    if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
      const itemDiscount = subtotal - totalAmount;
      if (bulkDiscount > itemDiscount) {
        totalAmount = subtotal * (1 - BULK_DISCOUNT_RATE);
      }
    }

    updateCartDisplay(subtotal);
    updateStockInfo();
    renderBonusPoints();
  }

  //장바구니 아이템정보
  function getCartItemInfo(cartItem) {
    const quantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1]
    );
    return [cartItem.id, quantity];
  }

  function findProductById(id) {
    return productList.find((p) => p.id === id);
  }

  function calculateItemDiscount(product, quantity) {
    return quantity >= 10 ? DISCOUNT_RATES[product.id] || 0 : 0;
  }

  function calculateItemDiscount(product, quantity) {
    return quantity >= 10 ? DISCOUNT_RATES[product.id] || 0 : 0;
  }

  function updateCartDisplay(subtotal) {
    let discountRate = (1 - totalAmount / subtotal).toFixed(2);
    let finalAmount = totalAmount;

    if (new Date().getDay() === 2) {
      finalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
      discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    }

    sumDisplay.textContent = `총액: ${Math.round(finalAmount)}원`;

    if (discountRate > 0) {
      const discountSpan = createElementWithClass(
        "span",
        "text-green-500 ml-2"
      );
      discountSpan.textContent = `(${(discountRate * 100).toFixed(
        1
      )}% 할인 적용)`;
      sumDisplay.appendChild(discountSpan);
    }

    // 화요일 할인 적용 후 totalAmount 업데이트
    totalAmount = finalAmount;
  }

  function updateStockInfo() {
    stockInfoDisplay.textContent = productList
      .filter((item) => item.quantity < 5)
      .map(
        (item) =>
          `${item.name}: ${
            item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"
          }`
      )
      .join("\n");
  }

  function renderBonusPoints() {
    bonusPoints += Math.floor(totalAmount / 1000) * POINTS_PER_1000_WON;
    let pointsTag = document.getElementById("loyalty-points");
    if (!pointsTag) {
      pointsTag = createElementWithClass("span", "text-blue-500 ml-2");
      pointsTag.id = "loyalty-points";
      sumDisplay.appendChild(pointsTag);
    }
    pointsTag.textContent = `(포인트: ${bonusPoints})`;
  }

  function handleAddToCart() {
    const selectedProductId = productSelect.value;
    const product = findProductById(selectedProductId);

    if (product && product.quantity > 0) {
      updateOrAddCartItem(product);
      calculateCart();
      lastSelectedProduct = selectedProductId;
    }
  }

  function updateOrAddCartItem(product) {
    const existingItem = document.getElementById(product.id);
    if (existingItem) {
      updateExistingCartItem(existingItem, product);
    } else {
      addNewCartItem(product);
    }
    product.quantity--;
  }

  function updateExistingCartItem(item, product) {
    const quantitySpan = item.querySelector("span");
    const newQuantity = parseInt(quantitySpan.textContent.split("x ")[1]) + 1;
    if (newQuantity <= product.quantity + 1) {
      quantitySpan.textContent = `${product.name} - ${product.value}원 x ${newQuantity}`;
    } else {
      alert("재고가 부족합니다.");
    }
  }

  function addNewCartItem(product) {
    const newItem = createElementWithClass(
      "div",
      "flex justify-between items-center mb-2"
    );
    newItem.id = product.id;
    newItem.innerHTML = `
        <span>${product.name} - ${product.value}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
        </div>
      `;
    cartDisplay.appendChild(newItem);
  }

  function handleCartAction(event) {
    const target = event.target;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const productId = target.dataset.productId;
      const product = findProductById(productId);
      const cartItem = document.getElementById(productId);

      if (target.classList.contains("quantity-change")) {
        handleQuantityChange(
          cartItem,
          product,
          parseInt(target.dataset.change)
        );
      } else if (target.classList.contains("remove-item")) {
        handleRemoveItem(cartItem, product);
      }

      calculateCart();
    }
  }

  function handleQuantityChange(cartItem, product, change) {
    const quantitySpan = cartItem.querySelector("span");
    const currentQuantity = parseInt(quantitySpan.textContent.split("x ")[1]);
    const newQuantity = currentQuantity + change;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      quantitySpan.textContent = `${product.name} - ${product.value}원 x ${newQuantity}`;
      product.quantity -= change;
    } else if (newQuantity <= 0) {
      cartItem.remove();
      product.quantity -= change;
    } else {
      alert("재고가 부족합니다.");
    }
  }

  function handleRemoveItem(cartItem, product) {
    const removedQuantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1]
    );
    product.quantity += removedQuantity;
    cartItem.remove();
  }

  function startPromotions() {
    setTimeout(() => {
      setInterval(runFlashSale, FLASH_SALE_INTERVAL);
    }, Math.random() * 10000);

    setTimeout(() => {
      setInterval(suggestProduct, SUGGESTION_INTERVAL);
    }, Math.random() * 20000);
  }

  function runFlashSale() {
    const luckyItem =
      productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < FLASH_SALE_PROBABILITY && luckyItem.quantity > 0) {
      luckyItem.value = Math.round(luckyItem.value * (1 - FLASH_SALE_DISCOUNT));
      alert(
        `번개세일! ${luckyItem.name}이(가) ${
          FLASH_SALE_DISCOUNT * 100
        }% 할인 중입니다!`
      );
      updateProductOptions();
    }
  }

  function suggestProduct() {
    if (lastSelectedProduct) {
      const suggestedProduct = productList.find(
        (item) => item.id !== lastSelectedProduct && item.quantity > 0
      );
      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 ${
            SUGGESTION_DISCOUNT * 100
          }% 추가 할인!`
        );
        suggestedProduct.value = Math.round(
          suggestedProduct.value * (1 - SUGGESTION_DISCOUNT)
        );
        updateProductOptions();
      }
    }
  }

  return { init };
})();

// 초기화
ShoppingApp.init();
