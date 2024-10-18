let productSelect, cartItemAddButton, cartItemList, cartTotal, stockStatus;
let lastSelect,
  bonusPts = 0,
  totalAmount = 0,
  cartItemTotalCnt = 0;

const prodList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const scheduleFlashSale = () => {
  setTimeout(() => {
    setInterval(() => {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        selectOptionAdd();
      }
    }, 30000);
  }, Math.random() * 10000);
};

const scheduleProductSuggestion = () => {
  setTimeout(() => {
    setInterval(() => {
      if (lastSelect) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSelect && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.val = Math.round(suggest.val * 0.95);
          selectOptionAdd();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

const createElement = (type, props, ...children) => {
  const element = document.createElement(type);
  Object.assign(element, props);

  children.forEach((child) => element.appendChild(child));

  return element;
};

const renderUi = () => {
  cartItemList = createElement("div", { id: "cart-items" });
  cartTotal = createElement("div", {
    id: "cart-total",
    className: "text-xl font-bold my-4",
  });

  productSelect = createElement("select", {
    id: "product-select",
    className: "border rounded p-2 mr-2",
  });
  cartItemAddButton = createElement("button", {
    id: "add-to-cart",
    className: "bg-blue-500 text-white px-4 py-2 rounded",
    textContent: "추가",
  });
  stockStatus = createElement("div", {
    id: "stock-status",
    className: "text-sm text-gray-500 mt-2",
  });

  const h1 = createElement("h1", {
    className: "text-2xl font-bold mb-4",
    textContent: "장바구니",
  });

  const wrap = createElement(
    "div",
    {
      className:
        "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    },
    h1,
    cartItemList,
    cartTotal,
    productSelect,
    cartItemAddButton,
    stockStatus
  );

  const content = createElement("div", { className: "bg-gray-100 p-8" }, wrap);
  document.getElementById("app").appendChild(content);
};

//html add
const main = () => {
  renderUi();
  selectOptionAdd();
  totalCalc();
  scheduleFlashSale();
  scheduleProductSuggestion();
};

//select에 selectOption 넣기
const selectOptionAdd = () => {
  prodList.forEach((item) => {
    let opt = createElement("option", {
      value: item.id,
      textContent: `${item.name} - ${item.val}원`,
      disabled: item.q === 0 && true,
    });

    productSelect.appendChild(opt);
  });
};

//현재 장바구니 상품 데이터 return
const findCartItemData = (id) => prodList.find((prod) => prod.id === id);

//한 상품, 특정개수 이상일 때  구매 할인 계산
const cartItemDiscountCalc = (cartItem, quantity) => {
  const DISCOUNT_THRESHOLD = 10;
  let discount = 0;

  if (quantity >= DISCOUNT_THRESHOLD) {
    switch (cartItem.id) {
      case "p1":
        discount = 0.1;
        break;
      case "p2":
        discount = 0.15;
        break;
      case "p3":
        discount = 0.2;
        break;
      case "p4":
        discount = 0.05;
        break;
      case "p5":
        discount = 0.25;
        break;
    }
  }

  return cartItem.val * quantity * (1 - discount);
};

//각 상품 총액 계산
const cartItemTotalCalc = () => {
  let totalAmount = 0; //최종 총액
  let cartItemTotalCnt = 0; //장바구니 총 아이템 개수
  let prevTotalAmount = 0; //할인 전 총액 저장 변수
  const cartItems = cartItemList.children;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItemElement = cartItems[i];
    const cartItemData = findCartItemData(cartItemElement.id);

    //cart 안에 있는 상품 개수
    const cartItemCnt = parseInt(
      cartItemElement.querySelector("span").textContent.split("x ")[1]
    );

    const itemTot = cartItemData.val * cartItemCnt; //아이템 총 금액

    prevTotalAmount += itemTot; //전체 금액에 아이템 총 금액 추가
    totalAmount += cartItemDiscountCalc(cartItemData, cartItemCnt);
    cartItemTotalCnt += cartItemCnt; //아이템 수량 업데이트
  }
  return { totalAmount, cartItemTotalCnt, prevTotalAmount };
};

//대량 구매 할인 계산
const BulkCartItemTotalCalc = (
  totalAmount,
  cartItemTotalCnt,
  prevTotalAmount
) => {
  const BULK_DISCOUNT_THRESHOLD = 30;
  let discountRate = (prevTotalAmount - totalAmount) / prevTotalAmount;

  if (cartItemTotalCnt >= BULK_DISCOUNT_THRESHOLD) {
    let bulkDiscount = totalAmount * 0.25;
    let itemDiscount = prevTotalAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = prevTotalAmount * (1 - 0.25);
      discountRate = 0.25;
    }
  }

  return discountRate;
};

//요일 할인 계산
const dayOfWeeklyDiscount = (totalAmount, discountRate) => {
  const DAY_OF_WEEKLY_DISCOUNT = 2;
  const isTuesday = new Date().getDay() === DAY_OF_WEEKLY_DISCOUNT;
  if (isTuesday) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  return { totalAmount, discountRate };
};

const addElement = (totalAmount, discountRate) => {
  //최종 총액 표시
  cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;

  //할인정보 표시
  if (discountRate > 0) {
    let span = createElement("span", {
      className: "text-green-500 ml-2",
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    cartTotal.appendChild(span);
  }
};

//총액 계산
const totalCalc = () => {
  let prevTotalAmount = 0;

  ({ totalAmount, cartItemTotalCnt, prevTotalAmount } = cartItemTotalCalc());

  let discountRate = BulkCartItemTotalCalc(
    totalAmount,
    cartItemTotalCnt,
    prevTotalAmount
  );

  ({ totalAmount, discountRate } = dayOfWeeklyDiscount(
    totalAmount,
    discountRate
  ));

  addElement(totalAmount, discountRate);
  updateStockStatus();
  pointCalc();
};

// 포인트 계산
const pointCalc = () => {
  bonusPts += Math.floor(totalAmount / 1000);

  let ptsTag = createElement("span", {
    id: "loyalty-points",
    className: "text-blue-500 ml-2",
    textContent: "(포인트: " + bonusPts + ")",
  });

  cartTotal.appendChild(ptsTag);
};

//재고 부족, 품절
const updateStockStatus = () => {
  let infoMsg = "";

  prodList.forEach((item) => {
    const status = item.q > 0 ? `재고 부족 (${item.q}개 남음)` : "품절";
    if (item.q < 5) infoMsg += `${item.name}: ${status}`;
  });
  stockStatus.textContent = infoMsg;
};

main();

const newCartItemAdd = (cartItemData) => {
  let newItem = createElement("div", {
    id: cartItemData.id,
    className: "flex justify-between items-center mb-2",
  });

  newItem.innerHTML =
    `<span>${cartItemData.name} - ${cartItemData.val}원 x 1</span>` +
    `<div><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${cartItemData.id} data-change="-1">-</button>` +
    `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${cartItemData.id} data-change="1">+</button>` +
    `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id=${cartItemData.id}>삭제</button></div>`;

  cartItemList.appendChild(newItem);
  cartItemData.q--;
};

const updateCartItemQuantity = (item, cartItemData, qtyChange) => {
  const spanElement = item.querySelector("span");
  const currentQuantity = parseInt(spanElement.textContent.split("x ")[1]);
  const newQuantity = currentQuantity + qtyChange;

  if (newQuantity > 0 && newQuantity <= cartItemData.q + currentQuantity) {
    spanElement.textContent = `${cartItemData.name} - ${cartItemData.val}원 x ${newQuantity}`;
    cartItemData.q -= qtyChange;
  } else if (newQuantity <= 0) {
    item.remove();
    cartItemData.q += currentQuantity;
  } else {
    alert("재고가 부족합니다.");
  }
};

//추가 버튼 눌렀을 때
cartItemAddButton.addEventListener("click", () => {
  let selectItemId = productSelect.value;
  let cartItemData = findCartItemData(selectItemId);

  //수량 있는지 확인
  if (cartItemData && cartItemData.q > 0) {
    let isCartItem = document.getElementById(cartItemData.id);

    if (isCartItem) updateCartItemQuantity(isCartItem, cartItemData, 1);
    else newCartItemAdd(cartItemData);

    totalCalc();
    lastSelect = selectItemId;
  }
});

//상품 +, -, 삭제
cartItemList.addEventListener("click", (event) => {
  const target = event.target;

  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const prodId = target.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find((p) => p.id === prodId);

    if (itemElem) {
      const qtyChange = target.classList.contains("quantity-change")
        ? parseInt(target.dataset.change)
        : -parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);

      updateCartItemQuantity(itemElem, prod, qtyChange);
      totalCalc();
    }
  }
});
