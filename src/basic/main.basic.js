const main = () => {};

main();
// 전역 변수
let productList,
  productSelect,
  addToCartButton,
  cartDisplay,
  totalAmountDisplay,
  stockStatusDisplay;
let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

// 상품 Select 옵션 업데이트
const updateProductSelectOptions = () => {
  productSelect.innerHTML = "";
  productList.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${item.price}원`;
    if (item.quantity === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
};

// 장바구니의 총액을 계산
const calculateCartTotal = () => {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let subtotal = 0;

  // 장바구니 항목 계산
  Array.from(cartItems).forEach((cartItem) => {
    const product = productList.find((p) => p.id === cartItem.id);
    const quantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1]
    );
    const itemTotal = product.price * quantity;
    itemCount += quantity;
    subtotal += itemTotal;

    // 할인 적용
    const discount = calculateDiscount(product, quantity);
    totalAmount += itemTotal * (1 - discount);
  });

  applyBulkDiscount(subtotal);
  applyTuesdayDiscount();
  displayTotalAmount();
  updateStockStatusDisplay();
  renderBonusPoints();
};

// 대량 구매 할인 적용
const applyBulkDiscount = (subtotal) => {
  if (itemCount >= 30) {
    const bulkDiscount = subtotal * 0.25;
    totalAmount = Math.min(totalAmount, subtotal - bulkDiscount);
  }
};

// 화요일 할인 적용
const applyTuesdayDiscount = () => {
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
  }
};

// 총액 표시
const displayTotalAmount = () => {
  totalAmountDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;
};

// 보너스 포인트 계산 및 표시
const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    totalAmountDisplay.appendChild(ptsTag);
  }
  ptsTag.textContent = `(포인트: ${bonusPoints})`;
};

// 재고 상태 업데이트
const updateStockStatusDisplay = () => {
  let infoMsg = "";
  productList.forEach((item) => {
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
    switch (product.id) {
      case "p1":
        return 0.1;
      case "p2":
        return 0.15;
      case "p3":
        return 0.2;
      case "p5":
        return 0.25;
      default:
        return 0;
    }
  }
  return 0;
};

// 번개 세일 처리 (랜덤으로 20% 할인)
const handleLuckySale = () => {
  const luckyItem = productList[Math.floor(Math.random() * productList.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8); // 20% 할인
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductSelectOptions(); // 상품 옵션 업데이트
  }
};

// 추천 세일 처리 (마지막 선택 상품과 다른 상품을 5% 할인)
const handleSuggestedSale = () => {
  if (lastSelectedProduct) {
    const suggestedItem = productList.find(
      (item) => item.id !== lastSelectedProduct && item.quantity > 0
    );
    if (suggestedItem) {
      suggestedItem.price = Math.round(suggestedItem.price * 0.95); // 5% 할인
      alert(
        `${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );
      updateProductSelectOptions(); // 상품 옵션 업데이트
    }
  }
};

const main = () => {
  // 상품 목록 초기화
  productList = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ];

  const root = document.getElementById("app");
  console.log(root);
  // HTML 요소 생성 및 설정
  const container = document.createElement("div");
  const wrapper = document.createElement("div");
  const headerText = document.createElement("h1");
  cartDisplay = document.createElement("div");
  totalAmountDisplay = document.createElement("div");
  productSelect = document.createElement("select");
  addToCartButton = document.createElement("button");
  stockStatusDisplay = document.createElement("div");

  // 클래스 및 ID 설정
  cartDisplay.id = "cart-items";
  totalAmountDisplay.id = "cart-total";
  productSelect.id = "product-select";
  addToCartButton.id = "add-to-cart";
  stockStatusDisplay.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headerText.className = "text-2xl font-bold mb-4";
  totalAmountDisplay.className = "text-xl font-bold my-4";
  productSelect.className = "border rounded p-2 mr-2";
  addToCartButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockStatusDisplay.className = "text-sm text-gray-500 mt-2";

  headerText.textContent = "장바구니";
  addToCartButton.textContent = "추가";

  updateProductSelectOptions();

  wrapper.appendChild(headerText);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalAmountDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockStatusDisplay);
  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCartTotal();

  // 번개 세일 및 추천 세일 타이머 설정
  setInterval(handleLuckySale, 30000);
  setInterval(handleSuggestedSale, 60000);
};

main();

// 이벤트 리스너 추가
addToCartButton.addEventListener("click", () => {
  const selectedProduct = productSelect.value;
  const productToAdd = productList.find((p) => p.id === selectedProduct);

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
    lastSelectedProduct = selectedProduct;
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
    const product = productList.find((p) => p.id === productId);

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
