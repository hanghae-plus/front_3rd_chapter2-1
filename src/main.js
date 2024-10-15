let lastSel;
let bonusPts = 0;
let totalAmt = 0;
let itemCnt = 0;

const prodList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
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
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * RANDOM_SALE_RATE.LUCKY_SALE);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, SALE_INTERVAL.LUCKY_INTERVAL);
  }, Math.random() * SALE_TIMEOUT.LUCKY_TIMEOUT);

  setTimeout(() => {
    setInterval(() => {
      if (lastSel) {
        const suggest = prodList.find(item => item.id !== lastSel && item.q > 0);
        if (suggest) {
          alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggest.val = Math.round(suggest.val * RANDOM_SALE_RATE.RECOMMEND_SALE);
          updateSelOpts();
        }
      }
    }, SALE_INTERVAL.RECOMMEND_INTERVAL);
  }, Math.random() * SALE_TIMEOUT.RECOMMEND_TIMEOUT);
};

const updateSelOpts = () => {
  $select.innerHTML = "";
  prodList.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;

    opt.textContent = item.name + " - " + item.val + "원";
    if (item.q === 0) {
      opt.disabled = true;
    }
    $select.appendChild(opt);
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
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      const SALE_RATE = {
        P1: 0.1,
        P2: 0.15,
        P3: 0.2,
        P4: 0.05,
        P5: 0.25,
      };
      const q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const MIN_SALE_ITEMS = 10;

      if (q >= MIN_SALE_ITEMS) {
        if (curItem.id === "p1") {
          disc = SALE_RATE.P1;
        } else if (curItem.id === "p2") {
          disc = SALE_RATE.P2;
        } else if (curItem.id === "p3") {
          disc = SALE_RATE.P3;
        } else if (curItem.id === "p4") {
          disc = SALE_RATE.P4;
        } else if (curItem.id === "p5") {
          disc = SALE_RATE.P5;
        }
      }
      totalAmt += itemTot * (1 - disc);
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
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * TO_PERCENT).toFixed(1) + "% 할인 적용)";
    $sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPts();
};

const renderBonusPts = () => {
  const POINTS_CONVERSION_RATE = 1000;
  bonusPts += Math.floor(totalAmt / POINTS_CONVERSION_RATE);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    $sum.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + bonusPts + ")";
};

const updateStockInfo = () => {
  let infoMsg = "";
  const MIN_STOCK = 5;
  prodList.forEach(item => {
    if (item.q < MIN_STOCK) {
      infoMsg +=
        item.name + ": " + (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") + "\n";
    }
  });
  $stockInfo.textContent = infoMsg;
};

main();

$addBtn.addEventListener("click", () => {
  const selItem = $select.value;
  const itemToAdd = prodList.find(p => p.id === selItem);
  if (itemToAdd && itemToAdd.q > 0) {
    const $item = document.getElementById(itemToAdd.id);
    if ($item) {
      const newQty = parseInt($item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.q) {
        $item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.val + "원 x " + newQty;
        itemToAdd.q--;
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
        itemToAdd.val +
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
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
});

$cartDisp.addEventListener("click", event => {
  const tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = prodList.find(p => p.id === prodId);
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.q + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const remQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
