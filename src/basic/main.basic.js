let products, productsSelectElement, addToCartBtnElement, cartItemsElement, cartTotalElement, stockStatusElement;
let lastSelectedItemId,
  loyaltyPoints = 0,
  finalTotalPrice = 0,
  totalItemCount = 0;

const main = () => {
  products = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ];

  const root = document.getElementById("app");

  const bgElement = document.createElement("div");
  bgElement.className = "bg-gray-100 p-8";

  const cartTitleElement = document.createElement("h1");
  cartTitleElement.className = "text-2xl font-bold mb-4";
  cartTitleElement.textContent = "장바구니";

  cartItemsElement = document.createElement("div");
  cartItemsElement.id = "cart-items";

  cartTotalElement = document.createElement("div");
  cartTotalElement.id = "cart-total";
  cartTotalElement.className = "text-xl font-bold my-4";

  productsSelectElement = document.createElement("select");
  productsSelectElement.id = "product-select";
  productsSelectElement.className = "border rounded p-2 mr-2";

  addToCartBtnElement = document.createElement("button");
  addToCartBtnElement.id = "add-to-cart";
  addToCartBtnElement.className = "bg-blue-500 text-white px-4 py-2 rounded";
  addToCartBtnElement.textContent = "추가";

  stockStatusElement = document.createElement("div");
  stockStatusElement.id = "stock-status";
  stockStatusElement.className = "text-sm text-gray-500 mt-2";

  const cartContainerElement = document.createElement("div");
  cartContainerElement.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  cartContainerElement.appendChild(cartTitleElement);
  cartContainerElement.appendChild(cartItemsElement);
  cartContainerElement.appendChild(cartTotalElement);
  cartContainerElement.appendChild(productsSelectElement);
  cartContainerElement.appendChild(addToCartBtnElement);
  cartContainerElement.appendChild(stockStatusElement);

  updateSelectOptions();

  bgElement.appendChild(cartContainerElement);

  root.appendChild(bgElement);

  calculateCartTotal();

  setTimeout(() => {
    setInterval(() => {
      const flashSaleItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && flashSaleItem.quantity > 0) {
        flashSaleItem.price = Math.round(flashSaleItem.price * 0.8);
        alert(`번개세일! ${flashSaleItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedItemId) {
        const instantDiscountItem = products.find((item) => item.id !== lastSelectedItemId && item.quantity > 0);

        if (instantDiscountItem) {
          alert(`${instantDiscountItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          instantDiscountItem.price = Math.round(instantDiscountItem.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

const calculateCartTotal = () => {
  finalTotalPrice = 0;
  totalItemCount = 0;
  let originalTotalPrice = 0;
  const cartItems = cartItemsElement.children;

  for (let i = 0; i < cartItems.length; i++) {
    let currentItem;

    for (let j = 0; j < products.length; j++) {
      if (products[j].id === cartItems[i].id) {
        currentItem = products[j];
        break;
      }
    }

    const currentItemQuantity = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
    const currentItemTotalPrice = currentItem.price * currentItemQuantity;
    let discountRate = 0;
    totalItemCount += currentItemQuantity;
    originalTotalPrice += currentItemTotalPrice;

    if (currentItemQuantity >= 10) {
      if (currentItem.id === "p1") {
        discountRate = 0.1;
      } else if (currentItem.id === "p2") {
        discountRate = 0.15;
      } else if (currentItem.id === "p3") {
        discountRate = 0.2;
      } else if (currentItem.id === "p4") {
        discountRate = 0.05;
      } else if (currentItem.id === "p5") {
        discountRate = 0.25;
      }
    }

    finalTotalPrice += currentItemTotalPrice * (1 - discountRate);
  }

  let discountRate = 0;

  if (totalItemCount >= 30) {
    const bulkDiscount = finalTotalPrice * 0.25;
    const itemDiscount = originalTotalPrice - finalTotalPrice;

    if (bulkDiscount > itemDiscount) {
      finalTotalPrice = originalTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (originalTotalPrice - finalTotalPrice) / originalTotalPrice;
    }
  } else {
    discountRate = (originalTotalPrice - finalTotalPrice) / originalTotalPrice;
  }

  if (new Date().getDay() === 2) {
    finalTotalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartTotalElement.textContent = `총액: ${Math.round(finalTotalPrice)}원`;

  if (discountRate > 0) {
    const percentageDiscountTextElement = document.createElement("span");
    percentageDiscountTextElement.className = "text-green-500 ml-2";
    percentageDiscountTextElement.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotalElement.appendChild(percentageDiscountTextElement);
  }

  updateStockStatus();
  updateLoyaltyPoints();
};

const updateSelectOptions = () => {
  productsSelectElement.innerHTML = "";

  products.forEach((item) => {
    const productsOptionElement = document.createElement("option");
    productsOptionElement.value = item.id;
    productsOptionElement.textContent = `${item.name} - ${item.price}원`;

    if (item.quantity === 0) {
      productsOptionElement.disabled = true;
    }

    productsSelectElement.appendChild(productsOptionElement);
  });
};

const updateLoyaltyPoints = () => {
  loyaltyPoints += Math.floor(finalTotalPrice / 1000);
  let loyaltyPointsElement = document.getElementById("loyalty-points");

  if (!loyaltyPointsElement) {
    loyaltyPointsElement = document.createElement("span");
    loyaltyPointsElement.id = "loyalty-points";
    loyaltyPointsElement.className = "text-blue-500 ml-2";
    cartTotalElement.appendChild(loyaltyPointsElement);
  }

  loyaltyPointsElement.textContent = `(포인트: ${loyaltyPoints})`;
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

main();

addToCartBtnElement.addEventListener("click", () => {
  const selectedProductId = productsSelectElement.value;
  const selectedItem = products.find((p) => p.id === selectedProductId);

  if (selectedItem && selectedItem.quantity > 0) {
    const selectedItemElement = document.getElementById(selectedItem.id);

    if (selectedItemElement) {
      const selectedItemQuantity = parseInt(selectedItemElement.querySelector("span").textContent.split("x ")[1]) + 1;

      if (selectedItemQuantity <= selectedItem.quantity) {
        selectedItemElement.querySelector("span").textContent =
          `${selectedItem.name} - ${selectedItem.price}원 x ${selectedItemQuantity}`;

        selectedItem.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newlySelectedItemElement = document.createElement("div");
      newlySelectedItemElement.id = selectedItem.id;
      newlySelectedItemElement.className = "flex justify-between items-center mb-2";
      newlySelectedItemElement.innerHTML = `
      <span>${selectedItem.name} - ${selectedItem.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                        data-product-id="${selectedItem.id}" data-change="-1">- </button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                        data-product-id="${selectedItem.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                        data-product-id="${selectedItem.id}">삭제</button>
      </div>`;

      cartItemsElement.appendChild(newlySelectedItemElement);
      selectedItem.quantity--;
    }

    calculateCartTotal();
    lastSelectedItemId = selectedProductId;
  }
});

cartItemsElement.addEventListener("click", (event) => {
  const buttonEventTarget = event.target;

  if (buttonEventTarget.classList.contains("quantity-change") || buttonEventTarget.classList.contains("remove-item")) {
    const clickedProductId = buttonEventTarget.dataset.productId;
    const clickedItemElement = document.getElementById(clickedProductId);
    const clickedItem = products.find((p) => p.id === clickedProductId);

    if (buttonEventTarget.classList.contains("quantity-change")) {
      const plusQuantity = parseInt(buttonEventTarget.dataset.change);
      const newQuantity = parseInt(clickedItemElement.querySelector("span").textContent.split("x ")[1]) + plusQuantity;

      if (
        newQuantity > 0 &&
        newQuantity <=
          clickedItem.quantity + parseInt(clickedItemElement.querySelector("span").textContent.split("x ")[1])
      ) {
        clickedItemElement.querySelector("span").textContent =
          `${clickedItemElement.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;

        clickedItem.quantity -= plusQuantity;
      } else if (newQuantity <= 0) {
        clickedItemElement.remove();

        clickedItem.quantity -= plusQuantity;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (buttonEventTarget.classList.contains("remove-item")) {
      const minusQuantity = parseInt(clickedItemElement.querySelector("span").textContent.split("x ")[1]);
      clickedItem.quantity += minusQuantity;
      clickedItemElement.remove();
    }

    calculateCartTotal();
  }
});
