const productList = [
  { id: "p1", name: "상품1", price: 10000, stock: 50 },
  { id: "p2", name: "상품2", price: 20000, stock: 30 },
  { id: "p3", name: "상품3", price: 30000, stock: 20 },
  { id: "p4", name: "상품4", price: 15000, stock: 0 },
  { id: "p5", name: "상품5", price: 25000, stock: 10 },
];

let productSelect, addToCartButton, cartDisplay, totalAmountDisplay, stockInfo;
let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

function main() {
  const root = document.getElementById("app");
  const container = document.createElement("div");
  const wrapper = document.createElement("div");
  const headingText = document.createElement("h1");
  cartDisplay = document.createElement("div");
  totalAmountDisplay = document.createElement("div");
  productSelect = document.createElement("select");
  addToCartButton = document.createElement("button");
  stockInfo = document.createElement("div");

  cartDisplay.id = "cart-items";
  totalAmountDisplay.id = "cart-total";
  productSelect.id = "product-select";
  addToCartButton.id = "add-to-cart";
  stockInfo.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headingText.className = "text-2xl font-bold mb-4";
  totalAmountDisplay.className = "text-xl font-bold my-4";
  productSelect.className = "border rounded p-2 mr-2";
  addToCartButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  headingText.textContent = "장바구니";
  addToCartButton.textContent = "추가";

  updateSelectOptions();

  wrapper.appendChild(headingText);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalAmountDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockInfo);
  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      let SaleProduct = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && SaleProduct.stock > 0) {
        SaleProduct.price = Math.round(SaleProduct.price * 0.8);
        alert("번개세일! " + SaleProduct.name + "이(가) 20% 할인 중입니다!");
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        let suggestedProduct = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.stock > 0;
        });
        if (suggestedProduct) {
          alert(suggestedProduct.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelectOptions() {
  productSelect.innerHTML = "";
  productList.forEach(function (item) {
    let opt = document.createElement("option");
    opt.value = item.id;

    opt.textContent = item.name + " - " + item.price + "원";
    if (item.stock === 0) opt.disabled = true;
    productSelect.appendChild(opt);
  });
}
function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  let cartItems = cartDisplay.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      let q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      let itemTot = curItem.price * q;
      let disc = 0;
      itemCount += q;
      subTot += itemTot;
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
    let bulkDisc = totalAmount * 0.25;
    let itemDisc = subTot - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  totalAmountDisplay.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    totalAmountDisplay.appendChild(span);
  }
  updateStockInfo();
  renderBonusPoints();
}
const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    totalAmountDisplay.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + bonusPoints + ")";
};

function updateStockInfo() {
  let infoMsg = "";
  productList.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ": " +
        (item.stock > 0 ? "재고 부족 (" + item.stock + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockInfo.textContent = infoMsg;
}
main();
addToCartButton.addEventListener("click", function () {
  let selItem = productSelect.value;
  let itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.stock > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.stock) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.stock--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      let newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.price +
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
      cartDisplay.appendChild(newItem);
      itemToAdd.stock--;
    }
    calculateCart();
    lastSelectedProduct = selItem;
  }
});
cartDisplay.addEventListener("click", function (event) {
  let tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.stock + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;
        prod.stock -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.stock -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      let remQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      prod.stock += remQty;
      itemElem.remove();
    }
    calculateCart();
  }
});
