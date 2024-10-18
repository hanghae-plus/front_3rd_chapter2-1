let lastSel;
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

const PRODUCT_LIST = [
  { id: "p1", name: "상품1", value: 10000, quantity: 50 },
  { id: "p2", name: "상품2", value: 20000, quantity: 30 },
  { id: "p3", name: "상품3", value: 30000, quantity: 20 },
  { id: "p4", name: "상품4", value: 15000, quantity: 0 },
  { id: "p5", name: "상품5", value: 25000, quantity: 10 },
];

const $root = document.getElementById("app");
const $container = document.createElement("div");
const $wrapper = document.createElement("div");
const $title = document.createElement("h1");

const $cartDisp = document.createElement("div");
const $sum = document.createElement("div");
const $select = document.createElement("select");
const $addBtn = document.createElement("button");
const $stockInfo = document.createElement("div");

const main = () => {
  $cartDisp.id = "cart-items";
  $sum.id = "cart-total";
  $select.id = "product-select";
  $addBtn.id = "add-to-cart";
  $stockInfo.id = "stock-status";

  $container.className = "bg-gray-100 p-8";
  $wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  $title.className = "text-2xl font-bold mb-4";
  $sum.className = "text-xl font-bold my-4";
  $select.className = "border rounded p-2 mr-2";
  $addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  $stockInfo.className = "text-sm text-gray-500 mt-2";

  $title.textContent = "장바구니";
  $addBtn.textContent = "추가";

  updateSelOpts();

  $wrapper.appendChild($title);
  $wrapper.appendChild($cartDisp);
  $wrapper.appendChild($sum);
  $wrapper.appendChild($select);
  $wrapper.appendChild($addBtn);
  $wrapper.appendChild($stockInfo);
  $container.appendChild($wrapper);
  $root.appendChild($container);

  calcCart();

  const RANDOM_SALE_RATE = {
    LUCKY_SALE: 0.8,
    RECOMMEND_SALE: 0.95,
  };

  const SALE_INTERVAL = {
    LUCKY_INTERVAL: 30000,
    RECOMMEND_INTERVAL: 60000,
  };

  const SALE_TIMEOUT = {
    LUCKY_TIMEOUT: 10000,
    RECOMMEND_TIMEOUT: 20000,
  };

  const LUCKY_SALE_PROBABILITY = 0.3;

  setTimeout(() => {
    setInterval(() => {
      const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.value = Math.round(luckyItem.value * RANDOM_SALE_RATE.LUCKY_SALE);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, SALE_INTERVAL.LUCKY_INTERVAL);
  }, Math.random() * SALE_TIMEOUT.LUCKY_TIMEOUT);

  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = PRODUCT_LIST.find(item => item.id !== lastSel && item.quantity > 0);
        if (suggest) {
          alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggest.value = Math.round(suggest.value * RANDOM_SALE_RATE.RECOMMEND_SALE);
          updateSelOpts();
        }
      }
    }, SALE_INTERVAL.RECOMMEND_INTERVAL);
  }, Math.random() * SALE_TIMEOUT.RECOMMEND_TIMEOUT);
};

const updateSelOpts = () => {
  $select.innerHTML = "";
  PRODUCT_LIST.forEach(item => {
    const $option = document.createElement("option");
    $option.value = item.id;

    $option.textContent = item.name + " - " + item.value + "원";
    if (item.quantity === 0) {
      $option.disabled = true;
    }
    $select.appendChild($option);
  });
};

const calcCart = () => {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = $cartDisp.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (() => {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }

      const SALE_RATE = {
        p1: 0.1,
        p2: 0.15,
        p3: 0.2,
        p4: 0.05,
        p5: 0.25,
      };

      const q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      const itemTotal = curItem.value * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTotal;
      const MIN_SALE_ITEMS = 10;

      if (q >= MIN_SALE_ITEMS) {
        disc = SALE_RATE[curItem.id];
      }
      totalAmt += itemTotal * (1 - disc);
    })();
  }

  let discRate = 0;
  const MIN_BULK_ITEMS = 30;
  const BULK_SALE_RATE = 0.25;
  if (itemCnt >= MIN_BULK_ITEMS) {
    const bulkDisc = totalAmt * BULK_SALE_RATE;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - BULK_SALE_RATE);
      discRate = BULK_SALE_RATE;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const SPECIAL_DAY = 2;
  const SPECIAL_DAY_DISCOUNT = 0.1;
  if (new Date().getDay() === SPECIAL_DAY) {
    totalAmt *= 1 - SPECIAL_DAY_DISCOUNT;
    discRate = Math.max(discRate, SPECIAL_DAY_DISCOUNT);
  }

  $sum.textContent = "총액: " + Math.round(totalAmt) + "원";

  const TO_PERCENT = 100;

  if (discRate > 0) {
    const $saleDesc = document.createElement("span");
    $saleDesc.className = "text-green-500 ml-2";
    $saleDesc.textContent = "(" + (discRate * TO_PERCENT).toFixed(1) + "% 할인 적용)";
    $sum.appendChild($saleDesc);
  }

  updateStockInfo();
  renderBonusPts();
};

const renderBonusPts = () => {
  const POINTS_CONVERSION_RATE = 1000;
  bonusPts += Math.floor(totalAmt / POINTS_CONVERSION_RATE);
  let $pointTag = document.getElementById("loyalty-points");
  if (!$pointTag) {
    $pointTag = document.createElement("span");
    $pointTag.id = "loyalty-points";
    $pointTag.className = "text-blue-500 ml-2";
    $sum.appendChild($pointTag);
  }
  $pointTag.textContent = "(포인트: " + bonusPts + ")";
};

const updateStockInfo = () => {
  let infoMessage = "";
  const MIN_STOCK = 5;
  PRODUCT_LIST.forEach(item => {
    if (item.quantity < MIN_STOCK) {
      infoMessage +=
        item.name +
        ": " +
        (item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음)" : "품절") +
        "\n";
    }
  });
  $stockInfo.textContent = infoMessage;
};

main();

$addBtn.addEventListener("click", () => {
  const selectedItem = $select.value;
  const itemToAdd = PRODUCT_LIST.find(p => p.id === selectedItem);
  if (itemToAdd && itemToAdd.quantity > 0) {
    const $item = document.getElementById(itemToAdd.id);
    if ($item) {
      const newQuantity = parseInt($item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQuantity <= itemToAdd.quantity) {
        $item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.value + "원 x " + newQuantity;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const $newItem = document.createElement("div");
      $newItem.id = itemToAdd.id;
      $newItem.className = "flex justify-between items-center mb-2";
      $newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.value +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $cartDisp.appendChild($newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selectedItem;
  }
});

$cartDisp.addEventListener("click", event => {
  const tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    const prodId = tgt.dataset.productId;
    const $itemElement = document.getElementById(prodId);
    const prod = PRODUCT_LIST.find(p => p.id === prodId);
    if (tgt.classList.contains("quantity-change")) {
      const QuantityChange = parseInt(tgt.dataset.change);
      const newQuantity =
        parseInt($itemElement.querySelector("span").textContent.split("x ")[1]) + QuantityChange;
      if (
        newQuantity > 0 &&
        newQuantity <=
          prod.quantity + parseInt($itemElement.querySelector("span").textContent.split("x ")[1])
      ) {
        $itemElement.querySelector("span").textContent =
          $itemElement.querySelector("span").textContent.split("x ")[0] + "x " + newQuantity;
        prod.quantity -= QuantityChange;
      } else if (newQuantity <= 0) {
        $itemElement.remove();
        prod.quantity -= QuantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const remQuantity = parseInt($itemElement.querySelector("span").textContent.split("x ")[1]);
      prod.quantity += remQuantity;
      $itemElement.remove();
    }
    calcCart();
  }
});
