let $productSelect, $addButton, $cartItems, $cartTotal, $stockStatus;
let lastSel,
  bonusPoints = 0,
  totalAmount = 0,
  itemCnt = 0;

const productList = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

function main() {
  const $root = document.getElementById("app");
  const $container = document.createElement("div");
  const $innerContainer = document.createElement("div");
  const $title = document.createElement("h1");
  $cartItems = document.createElement("div");
  $cartTotal = document.createElement("div");
  $productSelect = document.createElement("select");
  $addButton = document.createElement("button");
  $stockStatus = document.createElement("div");
  $cartItems.id = "cart-items";
  $cartTotal.id = "cart-total";
  $productSelect.id = "product-select";
  $addButton.id = "add-to-cart";

  $stockStatus.id = "stock-status";
  $container.className = "bg-gray-100 p-8";
  $innerContainer.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  $title.className = "text-2xl font-bold mb-4";
  $cartTotal.className = "text-xl font-bold my-4";
  $productSelect.className = "border rounded p-2 mr-2";
  $addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  $stockStatus.className = "text-sm text-gray-500 mt-2";
  $title.textContent = "장바구니";
  $addButton.textContent = "추가";
  updateProductOptions();
  $innerContainer.appendChild($title);
  $innerContainer.appendChild($cartItems);
  $innerContainer.appendChild($cartTotal);
  $innerContainer.appendChild($productSelect);
  $innerContainer.appendChild($addButton);
  $innerContainer.appendChild($stockStatus);
  $container.appendChild($innerContainer);
  $root.appendChild($container);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productList.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateProductOptions() {
  $productSelect.innerHTML = "";
  productList.forEach(function (item) {
    let opt = document.createElement("option");
    opt.value = item.id;

    opt.textContent = item.name + " - " + item.price + "원";
    if (item.quantity === 0) opt.disabled = true;
    $productSelect.appendChild(opt);
  });
}

function calcCart() {
  totalAmount = 0;
  itemCnt = 0;
  const cartItems = $cartItems.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1]
      );
      const productTotalPrice = currentProduct.price * quantity;
      const discount = getDiscount(currentProduct, quantity);
      itemCnt += quantity;
      subTot += productTotalPrice;
      totalAmount += productTotalPrice * (1 - discount);
    })();
  }
  let discountRate = getDiscountRate(itemCnt, subTot, totalAmount);

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  updateCartTotal(discountRate);
  updateStockInfo();
  calculateBonusPoints();
  updateBonusPoints(bonusPoints);
}

const getDiscount = (product, quantity) => {
  if (quantity >= 10) {
    switch (product.id) {
      case "p1":
        return 0.1;
      case "p2":
        return 0.15;
      case "p3":
        return 0.2;
      case "p4":
        return 0.05;
      case "p5":
        return 0.25;
      default:
        return 0;
    }
  }
  return 0;
};

const getDiscountRate = (itemCnt, subtotal, totalAmount) => {
  if (itemCnt >= 30) {
    const bulkDiscount = subtotal * 0.25;
    const itemDiscount = subtotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subtotal * (1 - 0.25);
      return 0.25;
    }
    return (subtotal - totalAmount) / subtotal;
  }
  return (subtotal - totalAmount) / subtotal;
};

const updateCartTotal = (discountRate) => {
  $cartTotal.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discountRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    $cartTotal.appendChild(span);
  }
};

const calculateBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
};

const updateBonusPoints = (bonusPoints) => {
  let pointsTag = document.getElementById("loyalty-points");
  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    $cartTotal.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};

const updateStockInfo = () => {
  let infoMessage = "";
  productList.forEach(function (product) {
    if (product.quantity < 5) {
      infoMessage +=
        product.name +
        ": " +
        (product.quantity > 0
          ? "재고 부족 (" + product.quantity + "개 남음)"
          : "품절") +
        "\n";
    }
  });
  $stockStatus.textContent = infoMessage;
};

main();

$addButton.addEventListener("click", function () {
  const selItem = $productSelect.value;
  const itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
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
      $cartItems.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  }
});

$cartItems.addEventListener("click", function (event) {
  const eventTarget = event.target;

  if (
    eventTarget.classList.contains("quantity-change") ||
    eventTarget.classList.contains("remove-item")
  ) {
    const prodId = eventTarget.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (eventTarget.classList.contains("quantity-change")) {
      const qtyChange = parseInt(eventTarget.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.quantity +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
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
    } else if (eventTarget.classList.contains("remove-item")) {
      const remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1]
      );
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
