const productList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const OUT_OF_STOCK_MESSAGE = "재고가 부족합니다.";

let $productSelect, $addToCartButton, $cartDisplay, $cartTotalDisplay, $stockMessage;

let lastSelectedProductId,
  point = 0,
  totalAmt = 0,
  itemCnt = 0;

function main() {
  createUI();

  updateProductSelectOption();

  calcCartTotal();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        updateProductSelectOption();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProductId) {
        var suggest = productList.find(function (item) {
          return item.id !== lastSelectedProductId && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
          suggest.val = Math.round(suggest.val * 0.95);
          updateProductSelectOption();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
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

function calcCartTotal() {
  totalAmt = 0;
  itemCnt = 0;
  var cartItems = $cartDisplay.children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      var q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      var itemTot = curItem.val * q;
      var disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === "p1") disc = 0.1;
        else if (curItem.id === "p2") disc = 0.15;
        else if (curItem.id === "p3") disc = 0.2;
        else if (curItem.id === "p4") disc = 0.05;
        else if (curItem.id === "p5") disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;
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
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $cartTotalDisplay.textContent = "총액: " + Math.round(totalAmt) + "원";
  if (discRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    $cartTotalDisplay.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}
const renderBonusPts = () => {
  point += Math.floor(totalAmt / 1000);
  var ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    $cartTotalDisplay.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + point + ")";
};

function updateStockInfo() {
  var infoMsg = "";
  productList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg += item.name + ": " + (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") + "\n";
    }
  });
  $stockMessage.textContent = infoMsg;
}

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

$cartDisplay.addEventListener("click", function (event) {
  var tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains("quantity-change")) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])) {
        itemElem.querySelector("span").textContent = itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert(OUT_OF_STOCK_MESSAGE);
      }
    } else if (tgt.classList.contains("remove-item")) {
      var remQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCartTotal();
  }
});

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
