const productList = [
  { id: "p1", name: "상품1", price: 10000, stock: 50 },
  { id: "p2", name: "상품2", price: 20000, stock: 30 },
  { id: "p3", name: "상품3", price: 30000, stock: 20 },
  { id: "p4", name: "상품4", price: 15000, stock: 0 },
  { id: "p5", name: "상품5", price: 25000, stock: 10 },
];

let lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

const cartDisplay = createElement("div", { id: "cart-items" });
const totalAmountDisplay = createElement("div", {
  id: "cart-total",
  className: "text-xl font-bold my-4",
});
const productSelect = createElement("select", {
  id: "product-select",
  className: "border rounded p-2 mr-2",
});
const addToCartButton = createElement(
  "button",
  { id: "add-to-cart", className: "bg-blue-500 text-white px-4 py-2 rounded" },
  "추가",
);
const stockInfoDisplay = createElement("div", {
  id: "stock-status",
  className: "text-sm text-gray-500 mt-2",
});

function createElement(tag, attributes = {}, textContent = "") {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach((attr) => {
    if (attr.startsWith("data-")) {
      element.setAttribute(attr, attributes[attr]);
    } else {
      element[attr] = attributes[attr];
    }
  });
  if (textContent) element.textContent = textContent;
  return element;
}

function initUI() {
  const root = document.getElementById("app");
  const container = createElement("div", { className: "bg-gray-100 p-8" });
  const wrapper = createElement("div", {
    className: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
  });
  const headingText = createElement("h1", { className: "text-2xl font-bold mb-4" }, "장바구니");

  wrapper.appendChild(headingText);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalAmountDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(stockInfoDisplay);
  container.appendChild(wrapper);
  root.appendChild(container);
}

function main() {
  initUI();
  updateSelectOptions();
  calculateCart();

  setTimeout(handleLuckySale, Math.random() * 10000);
  setTimeout(handleProductSuggestion, Math.random() * 20000);
}

function handleLuckySale() {
  setInterval(function () {
    let SaleProduct = productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < 0.3 && SaleProduct.stock > 0) {
      SaleProduct.price = Math.round(SaleProduct.price * 0.8);
      alert("번개세일! " + SaleProduct.name + "이(가) 20% 할인 중입니다!");
      updateSelectOptions();
    }
  }, 30000);
}

function handleProductSuggestion() {
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
}

function updateSelectOptions() {
  productSelect.innerHTML = "";
  productList.forEach((item) => {
    let option = createElement("option", { value: item.id }, `${item.name} - ${item.price}원`);
    if (item.stock === 0) option.disabled = true;
    productSelect.appendChild(option);
  });
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  let cartItems = cartDisplay.children;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = productList[i];
    const cartProduct = productList.find((product) => product.id === cartItem.id);

    let quantity = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
    let itemTotalPrice = cartProduct.price * quantity;
    let discount = calculateDiscountByItemQuantity(cartProduct, quantity);

    itemCount += quantity;
    subTotal += itemTotalPrice;

    totalAmount += itemTotalPrice * (1 - discount);
  }

  applyBulkDiscount(subTotal);
}

function calculateDiscountByItemQuantity(product, quantity) {
  if (quantity < 10) return 0;
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

function applyBulkDiscount(subTotal) {
  let discountRate = 0;
  const isTuesday = new Date().getDay() === 2;

  if (itemCount >= 30) {
    let bulkDiscount = totalAmount * 0.25;
    let itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (isTuesday) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  totalAmountDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    let discountElement = createElement(
      "span",
      { className: "text-green-500 ml-2" },
      `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    );
    totalAmountDisplay.appendChild(discountElement);
  }

  updateStockInfo();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmount / 1000);
  let pointsElement = document.getElementById("loyalty-points");
  if (!pointsElement) {
    pointsElement = createElement("span", {
      id: "loyalty-points",
      className: "text-blue-500 ml-2",
    });
    totalAmountDisplay.appendChild(pointsElement);
  }
  pointsElement.textContent = "(포인트: " + bonusPoints + ")";
};

function updateStockInfo() {
  let infoMessage = "";
  productList.forEach(function (item) {
    if (item.stock < 5) {
      infoMessage +=
        item.name +
        ": " +
        (item.stock > 0 ? "재고 부족 (" + item.stock + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockInfoDisplay.textContent = infoMessage;
}

main();

addToCartButton.addEventListener("click", onClickAddToCart);

function createCartItemElement(product) {
  const { name, price, id } = product;
  const newItemNameElement = createElement("span", {}, `${name} - ${price}원 x 1`);
  const newItemMinusButton = createElement(
    "button",
    {
      className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      "data-product-id": id,
      "data-change": "-1",
    },
    "-",
  );
  const newItemPlusButton = createElement(
    "button",
    {
      className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      "data-product-id": id,
      "data-change": "1",
    },
    "+",
  );
  const newItemRemoveButton = createElement(
    "button",
    {
      className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
      "data-product-id": id,
      "data-change": "-1",
    },
    "삭제",
  );
  const newItemButtonGroupElement = createElement("div", {});
  newItemButtonGroupElement.appendChild(newItemMinusButton);
  newItemButtonGroupElement.appendChild(newItemPlusButton);
  newItemButtonGroupElement.appendChild(newItemRemoveButton);
  let newItemElement = createElement("div", {
    id,
    className: "flex justify-between items-center mb-2",
  });
  newItemElement.appendChild(newItemNameElement);
  newItemElement.appendChild(newItemButtonGroupElement);
  return newItemElement;
}

function onClickAddToCart() {
  let selectedProductId = productSelect.value;
  let selectedProduct = productList.find((product) => product.id === selectedProductId);

  if (selectedProduct && selectedProduct.stock > 0) {
    let selectedProductElement = document.getElementById(selectedProduct.id);

    if (selectedProductElement) {
      const selectedProductCartAddedQuantity = selectedProductElement
        .querySelector("span")
        .textContent.split("x ")[1];
      let newQuantity = parseInt(selectedProductCartAddedQuantity) + 1;

      if (newQuantity <= selectedProduct.stock) {
        selectedProductElement.querySelector("span").textContent =
          selectedProduct.name + " - " + selectedProduct.price + "원 x " + newQuantity;
        selectedProduct.stock--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      let newItemElement = createCartItemElement(selectedProduct);
      cartDisplay.appendChild(newItemElement);
      selectedProduct.stock--;
    }
    calculateCart();
    lastSelectedProduct = selectedProductId;
  }
}

cartDisplay.addEventListener("click", function (event) {
  const { target } = event;

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const { productId } = target.dataset;
    let itemElement = document.getElementById(productId);
    let product = productList.find((product) => product.id === productId);

    if (target.classList.contains("quantity-change")) {
      let quantityChange = parseInt(target.dataset.change);
      let newQuantity =
        parseInt(itemElement.querySelector("span").textContent.split("x ")[1]) + quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          product.stock + parseInt(itemElement.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElement.querySelector("span").textContent =
          itemElement.querySelector("span").textContent.split("x ")[0] + "x " + newQuantity;
        product.stock -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.stock -= quantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      let remQty = parseInt(itemElement.querySelector("span").textContent.split("x ")[1]);
      product.stock += remQty;
      itemElement.remove();
    }
    calculateCart();
  }
});
