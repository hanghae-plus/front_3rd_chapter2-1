(function main() {
  const LOW_STOCK_ALERT_LIMIT = 5;
  const prodList = [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ];

  let lastSelectedItem;
  let bonusPts = 0;
  let totalAmt = 0;
  let itemCnt = 0;

  const root = document.getElementById("app");

  // option 초기화 하는 함수
  const initSlecOptsUI = () => {
    $selectEl.innerHTML = ""; //초기화
  };
  // option update 하는 함수
  const setSelOptsUI = () => {
    prodList.forEach(function (prod) {
      const opt = document.createElement("option");
      opt.value = prod.id;

      opt.textContent = `${prod.name} - ${prod.price}원`;
      if (prod.quantity === 0) opt.disabled = true;
      $selectEl.appendChild(opt);
    });
  };

  // cart에 담긴 상품 계산하는 로직
  const calcCart = () => {
    totalAmt = 0;
    itemCnt = 0;
    const cartItems = $cartItemsEl.children;
    let subTot = 0;
    for (let i = 0; i < cartItems.length; i++) {
      (function () {
        let curItem;
        for (let j = 0; j < prodList.length; j++) {
          if (prodList[j].id === cartItems[i].id) {
            curItem = prodList[j];
            break;
          }
        }

        const selectedQuantity = parseInt(
          cartItems[i].querySelector("span").textContent.split("x ")[1]
        );
        let itemTot = curItem.price * selectedQuantity;
        let PROD_DISCOUNT_RATE = 0;
        itemCnt += selectedQuantity;
        subTot += itemTot;
        if (selectedQuantity >= 10) {
          switch (curItem.id) {
            case "p1":
              PROD_DISCOUNT_RATE = 0.1;
              break;
            case "p2":
              PROD_DISCOUNT_RATE = 0.15;
              break;
            case "p3":
              PROD_DISCOUNT_RATE = 0.2;
              break;
            case "p4":
              PROD_DISCOUNT_RATE = 0.05;
              break;
            case "p5":
              PROD_DISCOUNT_RATE = 0.25;
              break;
            default:
              break;
          }
        }
        totalAmt += itemTot * (1 - PROD_DISCOUNT_RATE);
      })();
    }
    let discRate = 0;
    if (itemCnt >= 30) {
      // 30개 이상일 때 묶음 할인
      let bulkDisc = totalAmt * 0.25;
      let itemDisc = subTot - totalAmt;
      if (bulkDisc > itemDisc) {
        totalAmt = subTot * (1 - 0.25);
        discRate = 0.25;
      } else {
        discRate = (subTot - totalAmt) / subTot;
      }
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }

    if (new Date().getDay() === 2) {
      // 화요일 할인 적용
      totalAmt *= 1 - 0.1;
      discRate = Math.max(discRate, 0.1);
    }
    $totalAmountEl.textContent = "총액: " + Math.round(totalAmt) + "원";
    if (discRate > 0) {
      let span = document.createElement("span");
      span.className = "text-green-500 ml-2";
      span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
      $totalAmountEl.appendChild(span);
    }
    updateStockInfo();
    renderBonusPts();
  };
  const renderBonusPts = () => {
    bonusPts += Math.floor(totalAmt / 1000);
    let ptsTag = document.getElementById("loyalty-points");
    if (!ptsTag) {
      ptsTag = document.createElement("span");
      ptsTag.id = "loyalty-points";
      ptsTag.className = "text-blue-500 ml-2";
      $totalAmountEl.appendChild(ptsTag);
    }
    ptsTag.textContent = "(포인트: " + bonusPts + ")";
  };

  const updateStockInfo = () => {
    let infoMsg = "";
    prodList.forEach(function (item) {
      if (item.quantity < LOW_STOCK_ALERT_LIMIT) {
        infoMsg +=
          item.name +
          ": " +
          (item.quantity > 0
            ? "재고 부족 (" + item.quantity + "개 남음)"
            : "품절") +
          "\n";
      }
    });
    $stockInfoTxtEl.textContent = infoMsg;
  };

  // 번개세일 안내
  const openSaleAlert = () => {
    setTimeout(function () {
      setInterval(function () {
        let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
        if (Math.random() < 0.3 && luckyItem.quantity > 0) {
          luckyItem.price = Math.round(luckyItem.price * 0.8);
          alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
          initSlecOptsUI();
          setSelOptsUI();
        }
      }, 30000);
    }, Math.random() * 10000);
  };

  // 추천상품 알림 함수
  const openSuggestAlert = () => {
    setTimeout(function () {
      setInterval(function () {
        if (lastSelectedItem) {
          let suggest = prodList.find(function (item) {
            return item.id !== lastSelectedItem && item.quantity > 0;
          });
          if (suggest) {
            alert(
              suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
            );
            suggest.price = Math.round(suggest.price * 0.95);
            initSlecOptsUI();
            setSelOptsUI();
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  };

  // 추가 버튼 클릭시 이벤트 핸들러
  const handleClickAddToCartBtn = () => {
    const selItem = $selectEl.value;
    let itemToAdd = prodList.find(function (p) {
      return p.id === selItem;
    });
    if (itemToAdd && itemToAdd.quantity > 0) {
      let item = document.getElementById(itemToAdd.id);
      if (item) {
        let newQty =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
        if (newQty <= itemToAdd.quantity) {
          item.querySelector("span").textContent =
            itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
          itemToAdd.quantity--;
        } else {
          alert("재고가 부족합니다.");
        }
      } else {
        let newItem = document.createElement("div");
        newItem.id = itemToAdd.id;
        newItem.className = "flex justify-between items-center mb-2";

        newItem.innerHTML = `
            <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
            <div>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
              <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
            </div>
            `;
        $cartItemsEl.appendChild(newItem);
        itemToAdd.quantity--;
      }
      calcCart();
      lastSelectedItem = selItem;
    }
  };

  const handleClickCartItemsArea = (event) => {
    let tgt = event.target;

    if (
      tgt.classList.contains("quantity-change") ||
      tgt.classList.contains("remove-item")
    ) {
      let prodId = tgt.dataset.productId;
      let itemElem = document.getElementById(prodId);
      let prod = prodList.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains("quantity-change")) {
        let qtyChange = parseInt(tgt.dataset.change);
        let newQty =
          parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.quantity +
              parseInt(
                itemElem.querySelector("span").textContent.split("x ")[1]
              )
        ) {
          itemElem.querySelector("span").textContent =
            itemElem.querySelector("span").textContent.split("x ")[0] +
            "x " +
            newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.quantity -= qtyChange;
        } else {
          alert("재고가 부족합니다.");
        }
      } else if (tgt.classList.contains("remove-item")) {
        let remQty = parseInt(
          itemElem.querySelector("span").textContent.split("x ")[1]
        );
        prod.quantity += remQty;
        itemElem.remove();
      }
      calcCart();
    }
  };
  // 이벤트 리스너 등록
  const registerEventListeners = () => {
    $addToCartBtnEl.addEventListener("click", handleClickAddToCartBtn);
    $cartItemsEl.addEventListener("click", handleClickCartItemsArea);
  };
  root.innerHTML = `
  <div class=""bg-gray-100 p-8"">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items"></div>
          <div id="cart-total" class="text-xl font-bold my-4"></div>
          <select id="product-select" class="border rounded p-2 mr-2"></select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
          <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
  </div>
`;
  const $cartItemsEl = document.getElementById("cart-items");
  const $totalAmountEl = document.getElementById("cart-total");
  const $selectEl = document.getElementById("product-select");
  const $addToCartBtnEl = document.getElementById("add-to-cart");
  const $stockInfoTxtEl = document.getElementById("stock-status");

  const init = () => {
    setSelOptsUI();
    calcCart();
    openSaleAlert();
    openSuggestAlert();
    registerEventListeners();
  };

  init();
})();
