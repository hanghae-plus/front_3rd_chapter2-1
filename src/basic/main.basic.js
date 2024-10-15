//상수



//state
let productList = [];
let cartItems = new Map();
let lastSelectedProduct = null;
let bonusPoints = 0;
let totalAmount = 0;
let itemCount = 0;

// DOM Elements
let selectElement;
let addBtn 
let cartElement;
let sumElement;
let stockInfoElement;




export function main() {
    productList = [
    { id: "p1", name: "상품1", val: 10000, q: 50 },
    { id: "p2", name: "상품2", val: 20000, q: 30 },
    { id: "p3", name: "상품3", val: 30000, q: 20 },
    { id: "p4", name: "상품4", val: 15000, q: 0 },
    { id: "p5", name: "상품5", val: 25000, q: 10 },
  ];

  let root = document.getElementById("app");

  let cont = document.createElement("div");
  let wrap = document.createElement("div");
  let headerText = document.createElement("h1");

  cartElement = document.createElement("div");
  sumElement = document.createElement("div");
  selectElement = document.createElement("select");
  addBtn = document.createElement("button");
  stockInfoElement = document.createElement("div");

  cartElement.id = "cart-items";
  sumElement.id = "cart-total";
  selectElement.id = "product-select";
  addBtn.id = "add-to-cart";
  stockInfoElement.id = "stock-status";

  cont.className = "bg-gray-100 p-8";
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headerText.className = "text-2xl font-bold mb-4";
  sumElement.className = "text-xl font-bold my-4";
  selectElement.className = "border rounded p-2 mr-2";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfoElement.className = "text-sm text-gray-500 mt-2";

  headerText.textContent = "장바구니";
  addBtn.textContent = "추가";

  updateSelOpts();

  wrap.appendChild(headerText);
  wrap.appendChild(cartElement);
  wrap.appendChild(sumElement);
  wrap.appendChild(selectElement);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfoElement);
  cont.appendChild(wrap);
  root.appendChild(cont);

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        var suggest = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!",
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelOpts() {
    selectElement.innerHTML = "";
    productList.forEach(function (item) {
    var opt = document.createElement("option");
    opt.value = item.id;

    opt.textContent = item.name + " - " + item.val + "원";
    if (item.q === 0) opt.disabled = true;
    selectElement.appendChild(opt);
  });
}

function calcCart() {
  totalAmount = 0;
  itemCount = 0;
  var cartItems = cartElement.children;
  var totalPriceBeforeDiscount = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      var q = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1],
      );
      var itemTot = curItem.val * q;
      var disc = 0;
      itemCount += q;
      totalPriceBeforeDiscount += itemTot;
      if (q >= 10) {
        if (curItem.id === "p1") disc = 0.1;
        else if (curItem.id === "p2") disc = 0.15;
        else if (curItem.id === "p3") disc = 0.2;
        else if (curItem.id === "p4") disc = 0.05;
        else if (curItem.id === "p5") disc = 0.25;
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCount >= 30) {
    var bulkDisc = totalAmount * 0.25;
    var itemDisc = totalPriceBeforeDiscount - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = totalPriceBeforeDiscount * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (totalPriceBeforeDiscount - totalAmount) / totalPriceBeforeDiscount;
    }
  } else {
    discRate = (totalPriceBeforeDiscount - totalAmount) / totalPriceBeforeDiscount;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  sumElement.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    sumElement.appendChild(span);
  }
  updateStockInfoElement();
  updateBonusPoint();
}

const updateBonusPoint = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
  var pointTag = document.getElementById("loyalty-points");
  if (!pointTag) {
    pointTag = document.createElement("span");
    pointTag.id = "loyalty-points";
    pointTag.className = "text-blue-500 ml-2";
    console.log("ptsTag",pointTag)

    sumElement.appendChild(pointTag);
  }
  pointTag.textContent = "(포인트: " + bonusPoints + ")";
  console.log("pointTag.textContent",pointTag.textContent)

};

function updateStockInfoElement() {
  var infoMsg = "";
  productList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg +=
        item.name +
        ": " +
        (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockInfoElement.textContent = infoMsg;
}

main();

addBtn.addEventListener("click", function () {
  var selItem = selectElement.value;
  var itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });

  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.val + "원 x " + newQty;
        itemToAdd.q--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
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
        cartElement.appendChild(newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSelectedProduct = selItem;

  }
});
cartElement.addEventListener("click", function (event) {
  var tgt = event.target;

  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.q +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      var remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1],
      );
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});


