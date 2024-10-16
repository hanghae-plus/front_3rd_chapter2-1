let products, productSelectElement, addToCartBtnElement, cartItemsElement, cartTotalElement, stockStatusElement;
let lastAddedItemId,
  loyaltyPoints = 0,
  finalTotalPrice = 0,
  totalItemCount = 0,
  discountRate = 0;

const DISCOUNT_LIST = {
  bulk: { condition: totalItemCount >= 30, rate: 0.25 },
  tuesday: { condition: (date) => date.getDay() === 2, rate: 0.1 },
  flashSale: { condition: (flashSaleItem) => Math.random() < 0.3 && flashSaleItem.quantity > 0, rate: 0.2 },
  instantDiscount: {
    condition: (instantDiscountItem) => (instantDiscountItem ? true : false),
    rate: 0.05,
  },
};

const FLASH_SALE_INTERVAL_MS = 30000;
const INSTANT_DISCOUNT_INTERVAL_MS = 60000;

const CartPageTemplate = () => `<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items"></div>
      <div id="cart-total" class="text-xl font-bold my-4"></div>
      <select id="product-select" class="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
      <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
    </div>
  </div>`;

const discountPercentageTemplate = (discountPercentage) =>
  `<span class="text-green-500 ml-2">(${discountPercentage.toFixed(1)}% 할인 적용)</span>`;

const productOptionTemplate = (item) =>
  `<option value=${item.id} ${item.quantity === 0 && "disabled"}>${item.name} - ${item.price}원</option>`;

const loyaltyPointsTemplate = () =>
  `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${loyaltyPoints})</span>`;

const firstAddedItemTemplate = (item) => `<div id=${item.id} class="flex justify-between items-center mb-2">
      <span>${item.name} - ${item.price}원 x 1</span>
      <div>
        <button 
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id=${item.id}
          data-change="-1"
        >
          -
        </button>
        <button 
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id=${item.id}
          data-change="1"
        >
          +
        </button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id=${item.id}>
          삭제
        </button>
      
      </div>
  </div>`;

const main = () => {
  products = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50, discountRate: 0.1 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30, discountRate: 0.15 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20, discountRate: 0.2 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0, discountRate: 0.05 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10, discountRate: 0.25 },
  ];

  const root = document.getElementById("app");
  root.innerHTML = CartPageTemplate();

  productSelectElement = document.getElementById("product-select");
  addToCartBtnElement = document.getElementById("add-to-cart");
  cartItemsElement = document.getElementById("cart-items");
  cartTotalElement = document.getElementById("cart-total");
  stockStatusElement = document.getElementById("stock-status");

  updateProductSelectOptions();
  calculateCartTotal();

  setTimeout(() => {
    setInterval(alertFlashSaleItem, FLASH_SALE_INTERVAL_MS);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(alertInstantDiscountItem, INSTANT_DISCOUNT_INTERVAL_MS);
  }, Math.random() * 20000);
};

const alertFlashSaleItem = () => {
  const flashSaleItem = products[Math.floor(Math.random() * products.length)];

  if (DISCOUNT_LIST.flashSale.condition(flashSaleItem)) {
    flashSaleItem.price = Math.round(flashSaleItem.price * (1 - DISCOUNT_LIST.flashSale.rate));
    updateProductSelectOptions();

    alert(`번개세일! ${flashSaleItem.name}이(가) ${DISCOUNT_LIST.flashSale.rate * 100}% 할인 중입니다!`);
  }
};

const alertInstantDiscountItem = () => {
  if (!lastAddedItemId) {
    return;
  }

  const instantDiscountItem = products.find((item) => item.id !== lastAddedItemId && item.quantity > 0);

  if (DISCOUNT_LIST.instantDiscount.condition(instantDiscountItem)) {
    instantDiscountItem.price = Math.round(instantDiscountItem.price * (1 - DISCOUNT_LIST.instantDiscount.rate));
    updateProductSelectOptions();

    alert(
      `${instantDiscountItem.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_LIST.instantDiscount.rate * 100}% 추가 할인!`,
    );
  }
};

const calculateCartTotal = () => {
  finalTotalPrice = 0;
  totalItemCount = 0;
  discountRate = 0;

  const cartItemsInElement = Array.from(cartItemsElement.children);
  const cartItems = cartItemsInElement.map((item) => {
    const _item = products.find((product) => product.id === item.id);
    const _itemCount = parseInt(item.querySelector("span").textContent.split("x ")[1]);
    totalItemCount += _itemCount;

    return { ..._item, count: _itemCount };
  });

  if (cartItems.length === 0) {
    return;
  }

  finalTotalPrice = cartItems.reduce((_finalTotalPrice, currentItem) => {
    const _discountRate = currentItem.count >= 10 ? currentItem.discountRate : 0;

    return (_finalTotalPrice += currentItem.count * currentItem.price * (1 - _discountRate));
  }, 0);

  calculateCartDiscount(cartItems);

  updateCartTotal();
  updateStockStatus();
  updateLoyaltyPoints();
};

const calculateCartDiscount = (cartItems) => {
  const originalTotalPrice = cartItems.reduce(
    (_originalTotalPrice, currentItem) => (_originalTotalPrice += currentItem.count * currentItem.price),
    0,
  );

  // 30개 이상 구매시 25% 할인
  if (DISCOUNT_LIST.bulk.condition) {
    finalTotalPrice = originalTotalPrice * (1 - DISCOUNT_LIST.bulk.rate);
  }

  discountRate = 1 - finalTotalPrice / originalTotalPrice;

  // 화요일 - 특별할인 10%
  if (DISCOUNT_LIST.tuesday.condition(new Date())) {
    finalTotalPrice *= 1 - DISCOUNT_LIST.tuesday.rate;
    discountRate = Math.max(discountRate, DISCOUNT_LIST.tuesday.rate);
  }
};

const updateCartTotal = () => {
  cartTotalElement.textContent = `총액: ${Math.round(finalTotalPrice)}원`;

  if (discountRate > 0) {
    cartTotalElement.innerHTML += discountPercentageTemplate(discountRate * 100);
  }
};

const updateProductSelectOptions = () => {
  productSelectElement.innerHTML = "";

  products.forEach((item) => {
    productSelectElement.innerHTML += productOptionTemplate(item);
  });
};

const updateLoyaltyPoints = () => {
  loyaltyPoints += Math.floor(finalTotalPrice / 1000);
  const loyaltyPointsElement = document.getElementById("loyalty-points");

  if (!loyaltyPointsElement) {
    cartTotalElement.innerHTML += loyaltyPointsTemplate();
  }
};

const updateStockStatus = () => {
  let stockStatusMsg = "";

  products.forEach((item) => {
    if (item.quantity < 5) {
      stockStatusMsg += `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"}\n`;
    }
  });

  stockStatusElement.textContent = stockStatusMsg;
};

const updateCartItems = (addedItem) => {
  const addedItemElement = document.getElementById(addedItem.id);

  if (addedItemElement === null) {
    cartItemsElement.innerHTML += firstAddedItemTemplate(addedItem);
    addedItem.quantity--;

    return;
  }

  const existingItemSpan = addedItemElement.querySelector("span");
  const currentItemQuantity = parseInt(existingItemSpan.textContent.split("x ")[1]) + 1;

  if (currentItemQuantity <= addedItem.quantity) {
    existingItemSpan.textContent = `${addedItem.name} - ${addedItem.price}원 x ${currentItemQuantity}`;

    addedItem.quantity--;
  } else {
    alert("재고가 부족합니다.");
  }
};

const updateQuantityChangedCartItem = (productId, quantityChange) => {
  const clickedItemElement = document.getElementById(productId);
  const clickedItem = products.find((product) => product.id === productId);
  const existingItemSpan = clickedItemElement.querySelector("span");

  const currentQuantity = parseInt(existingItemSpan.textContent.split("x ")[1]);
  const newQuantity = currentQuantity + quantityChange;

  if (0 < quantityChange && quantityChange <= clickedItem.quantity) {
    existingItemSpan.textContent = `${clickedItem.name} - ${clickedItem.price}원 x ${newQuantity}`;

    clickedItem.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    clickedItemElement.remove();

    clickedItem.quantity -= quantityChange;
  } else {
    alert("재고가 부족합니다.");
  }
};

const updateRemovedCartItem = (productId) => {
  const removeTargetElement = document.getElementById(productId);
  const clickedItem = products.find((product) => product.id === productId);
  const existingItemSpan = removeTargetElement.querySelector("span");
  const currentQuantity = parseInt(existingItemSpan.textContent.split("x ")[1]);

  removeTargetElement.remove();

  clickedItem.quantity += currentQuantity;
};

const handleClickAddToCartBtn = () => {
  const addedItemId = productSelectElement.value;
  const addedItem = products.find((product) => product.id === addedItemId);
  const isInStock = addedItem && addedItem.quantity > 0;

  if (!isInStock) {
    return;
  }

  updateCartItems(addedItem);
  calculateCartTotal();

  lastAddedItemId = addedItemId;
};

const handleClickCartItems = (event) => {
  const { classList, dataset } = event.target;
  const isClickedAddBtn = classList.contains("quantity-change");
  const isClickedRemoveBtn = classList.contains("remove-item");

  const clickedProductId = dataset.productId;

  if (isClickedAddBtn) {
    const quantityChange = parseInt(dataset.change);
    updateQuantityChangedCartItem(clickedProductId, quantityChange);
  } else if (isClickedRemoveBtn) {
    updateRemovedCartItem(clickedProductId);
  }

  calculateCartTotal();
};

main();

addToCartBtnElement.addEventListener("click", handleClickAddToCartBtn);
cartItemsElement.addEventListener("click", handleClickCartItems);
