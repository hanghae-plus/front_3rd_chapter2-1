const productList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const PRODUCT_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const OUT_OF_STOCK_MESSAGE = "재고가 부족합니다.";

const DISCOUNT_QUANTITY = 10; // 기본 할인 적용 수량
const BULK_DISCOUNT_QUANTITY = 30; // 추가 할인 적용 수량
const BULK_DISCOUNT_RATE = 0.25; // 추가 할인 비율
const WEEKDAY_DISCOUNT_RATE = 0.1; // 요일별 추가 할인 비율
const TUESDAY_INDEX = 2; // 화요일 인덱스 (요일별 추가 할인 적용할 인덱스)

const LUCKY_ITEM_DISCOUNT_RATE = 0.2; // 20% 할인
const LUCKY_ITEM_INTERVAL = 30000; // 번개세일 간격 (30초)
const SUGGESTION_INTERVAL = 60000; // 추천 상품 알림 간격 (60초)
const SUGGESTION_DISCOUNT_RATE = 0.05; // 추천 상품 할인율 (5%)
const INITIAL_DELAY_MIN = 0; // 초기 딜레이 최소값
const INITIAL_DELAY_MAX = 10000; // 초기 딜레이 최대값 (10초)
const SUGGESTION_DELAY_MIN = 0; // 추천 초기 딜레이 최소값
const SUGGESTION_DELAY_MAX = 20000; // 추천 초기 딜레이 최대값 (20초)

let $productSelect, $addToCartButton, $cartDisplay, $cartTotalDisplay, $stockMessage;

let lastSelectedProductId,
  point = 0,
  cartTotalAmount = 0,
  itemCnt = 0;

//번개세일
const startLuckySale = () => {
  setInterval(function () {
    const luckyItem = productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < 0.3 && luckyItem.q > 0) {
      luckyItem.val = Math.round(luckyItem.val * (1 - LUCKY_ITEM_DISCOUNT_RATE));
      alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
      updateProductSelectOption();
    }
  }, LUCKY_ITEM_INTERVAL);
};

//상품추천
const startProductSuggestion = () => {
  setInterval(function () {
    if (lastSelectedProductId) {
      var suggestProduct = productList.find(function (item) {
        return item.id !== lastSelectedProductId && item.q > 0;
      });
      if (suggestProduct) {
        alert(suggestProduct.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
        suggestProduct.val = Math.round(suggestProduct.val * (1 - SUGGESTION_DISCOUNT_RATE));
        updateProductSelectOption();
      }
    }
  }, SUGGESTION_INTERVAL);
};

function main() {
  createUI();

  updateProductSelectOption();

  calcCartTotal();

  setTimeout(startLuckySale, Math.random() * INITIAL_DELAY_MAX);
  setTimeout(startProductSuggestion, Math.random() * SUGGESTION_DELAY_MAX);
}

// tag 만들기 함수
function createElement(tag, id, className, textContent) {
  const $element = document.createElement(tag);

  if (id) {
    $element.id = id;
  }

  if (className) {
    $element.className = className;
  }

  if (textContent) {
    $element.textContent = textContent;
  }

  return $element;
}

//UI 만들기
function createUI() {
  let $root = document.getElementById("app");

  let $container = createElement("div", null, "bg-gray-100 p-8");
  let $wrapper = createElement("div", null, "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8");
  let $header = createElement("h1", null, "text-2xl font-bold mb-4", "장바구니");

  $cartDisplay = createElement("div", "cart-items");
  $cartTotalDisplay = createElement("div", "cart-total", "text-xl font-bold my-4");
  $productSelect = createElement("select", "product-select", "border rounded p-2 mr-2");
  $addToCartButton = createElement("button", "add-to-cart", "bg-blue-500 text-white px-4 py-2 rounded", "추가");
  $stockMessage = createElement("div", "stock-status", "text-sm text-gray-500 mt-2");

  updateProductSelectOption();

  $wrapper.append($header, $cartDisplay, $cartTotalDisplay, $productSelect, $addToCartButton, $stockMessage);

  $container.appendChild($wrapper);
  $root.appendChild($container);
}

// 상품 select 업데이트
function updateProductSelectOption() {
  $productSelect.innerHTML = "";

  productList.forEach(function (item) {
    let $option = createElement("option", null, null, item.name + " - " + item.val + "원");
    $option.value = item.id;

    if (item.q === 0) {
      $option.disabled = true;
    }
    $productSelect.appendChild($option);
  });
}

const calcCartTotal = () => {
  let totalAmount = 0; // 총액
  let cartItemCount = 0; // 상품 개수
  let cartItemList = Array.from($cartDisplay.children); // 장바구니 아이템 리스트
  let subTotalAmt = 0;

  cartItemList.forEach((cartItem) => {
    let currentProduct = productList.find((product) => product.id === cartItem.id); // 해당 아이템 찾기

    if (currentProduct) {
      let quantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]); // 수량 가져오기
      let itemTotal = currentProduct.val * quantity; // 개별 상품 총액
      let discount = 0; // 기본 할인율

      cartItemCount += quantity;
      subTotalAmt += itemTotal;

      if (quantity >= DISCOUNT_QUANTITY && PRODUCT_DISCOUNT_RATE[currentProduct.id]) {
        // DISCOUNT_QUANTITY 이상 구매 시, 할인율 적용
        discount = PRODUCT_DISCOUNT_RATE[currentProduct.id];
      }

      totalAmount += itemTotal * (1 - discount);
    }
  });

  let discountRate = 0;

  if (cartItemCount >= BULK_DISCOUNT_QUANTITY) {
    // BULK_DISCOUNT_QUANTITY 이상 구매 시 추가 할인
    let bulkDiscount = subTotalAmt * BULK_DISCOUNT_RATE; // 25% 할인 적용
    let itemDiscount = subTotalAmt - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotalAmt * (1 - BULK_DISCOUNT_RATE); // 25% 할인 적용
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (subTotalAmt - totalAmount) / subTotalAmt;
    }
  } else {
    discountRate = (subTotalAmt - totalAmount) / subTotalAmt;
  }

  if (new Date().getDay() === TUESDAY_INDEX) {
    // 화요일은 추가 WEEKDAY_DISCOUNT_RATE 할인
    totalAmount *= 1 - WEEKDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, WEEKDAY_DISCOUNT_RATE);
  }

  // 결과 출력
  $cartTotalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    const $discountSpan = createElement("span", null, "text-green-500 ml-2", `(${(discountRate * 100).toFixed(1)}% 할인 적용)`);
    $cartTotalDisplay.appendChild($discountSpan);
  }

  cartTotalAmount = totalAmount; // 전역변수에 업데이트
  displayStock(); // 재고 정보 표시
  updatePoint(); // 포인트 업데이트
};

// 포인트 업데이트
const updatePoint = () => {
  point += Math.floor(cartTotalAmount / 1000);

  let $pointElement = document.getElementById("loyalty-points");

  if (!$pointElement) {
    $pointElement = createElement("span", "loyalty-points", "text-blue-500 ml-2");
    $cartTotalDisplay.appendChild($pointElement);
  }

  $pointElement.textContent = `(포인트: ${point})`;
};

// 재고 표시
const displayStock = () => {
  let stockMessage = "";

  productList.forEach(function (item) {
    if (item.q < 5) {
      stockMessage += `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절"}\n`;
    }
  });

  $stockMessage.textContent = stockMessage;
};

main();

// 선택된 제품 정보 찾기
function findSelectedProduct() {
  return productList.find(function (p) {
    return p.id === $productSelect.value;
  });
}

// 장바구니에 추가
const handleClickAddToCart = () => {
  // 1. 선택된 제품 정보 찾기
  const selectedProduct = findSelectedProduct();

  if (selectedProduct && selectedProduct.q > 0) {
    let existingProduct = document.getElementById(selectedProduct.id);

    if (existingProduct) {
      // 2. 이미 장바구니에 있으면 수량만 업데이트
      var newQty = parseInt(existingProduct.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQty <= selectedProduct.q) {
        existingProduct.querySelector("span").textContent = selectedProduct.name + " - " + selectedProduct.val + "원 x " + newQty;
        selectedProduct.q--;
      } else {
        alert(OUT_OF_STOCK_MESSAGE);
      }
    } else {
      // 3. 장바구니에 없으면(새로운 상품이면) 새항목을 추가
      let newItem = createElement("div", selectedProduct.id, "flex justify-between items-center mb-2");

      newItem.innerHTML = `
        <span>${selectedProduct.name} - ${selectedProduct.val}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
        </div>
      `;

      $cartDisplay.appendChild(newItem);
      selectedProduct.q--;
    }
    calcCartTotal();
    lastSelectedProductId = selectedProduct.id;
  }
};

// 추가버튼 클릭시
$addToCartButton.addEventListener("click", handleClickAddToCart);

// 수량변경
const handleChangeQuantity = ($clickedElement, $productItem, clickedProduct) => {
  let changeInQuantity = parseInt($clickedElement.dataset.change);
  let updatedQuantity = parseInt($productItem.querySelector("span").textContent.split("x ")[1]) + changeInQuantity;

  if (updatedQuantity > 0 && updatedQuantity <= clickedProduct.q + parseInt($productItem.querySelector("span").textContent.split("x ")[1])) {
    //1. 업데이트된 수량 > 0 && 업데이트된 수량 <= 재고 + 현재수량

    $productItem.querySelector("span").textContent = $productItem.querySelector("span").textContent.split("x ")[0] + "x " + updatedQuantity;
    clickedProduct.q -= changeInQuantity;
  } else if (updatedQuantity <= 0) {
    //2. 업데이트된 수량 0 이되면 productItem을 삭제
    $productItem.remove();
    clickedProduct.q -= changeInQuantity;
  } else {
    alert(OUT_OF_STOCK_MESSAGE);
  }
};

// 아이템 삭제
const handleRemoveProductItem = ($productItem, clickedProduct) => {
  let removedQuantity = parseInt($productItem.querySelector("span").textContent.split("x ")[1]);
  clickedProduct.q += removedQuantity;
  $productItem.remove();
};

const handleClickCartItem = (event) => {
  let $clickedElement = event.target;

  //1. 어떤 아이템(수량변경 or 삭제)을 클릭했는지 분기
  if ($clickedElement.classList.contains("quantity-change") || $clickedElement.classList.contains("remove-item")) {
    let productId = $clickedElement.dataset.productId;
    let $productItem = document.getElementById(productId);

    var clickedProduct = productList.find(function (p) {
      return p.id === productId;
    });

    if ($clickedElement.classList.contains("quantity-change")) {
      handleChangeQuantity($clickedElement, $productItem, clickedProduct);
    } else if ($clickedElement.classList.contains("remove-item")) {
      handleRemoveProductItem($productItem, clickedProduct);
    }
    calcCartTotal();
  }
};

// 장바구니 안에 아이템 클릭시 (+,-,삭제)
$cartDisplay.addEventListener("click", handleClickCartItem);
