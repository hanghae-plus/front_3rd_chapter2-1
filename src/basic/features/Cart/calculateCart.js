import { getProductList } from "../../stores/productListStore";

let totalAmount, itemCount;
let cartTotal, cartDisplay;

export function calculateCart() {
  cartDisplay = document.getElementById("cart-items");
  cartTotal = document.getElementById("cart-total");

  itemCount = 0;
  totalAmount = 0;

  const cartItems = cartDisplay.children;
  const productList = getProductList();

  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    let currentProduct;

    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        currentProduct = productList[j];
        break;
      }
    }

    let quantity = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
    const itemTotal = currentProduct.price * quantity;
    let disc = 0;
    itemCount += quantity;
    subTotal += itemTotal;
    if (quantity >= 10) {
      if (currentProduct.id === "p1") disc = 0.1;
      else if (currentProduct.id === "p2") disc = 0.15;
      else if (currentProduct.id === "p3") disc = 0.2;
      else if (currentProduct.id === "p4") disc = 0.05;
      else if (currentProduct.id === "p5") disc = 0.25;
    }
    totalAmount += itemTotal * (1 - disc);
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    let bulkDiscount = totalAmount * 0.25;
    let productDiscount = subTotal - totalAmount;
    if (bulkDiscount > productDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartTotal.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discountRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderbonusPoints();
}
const renderbonusPoints = () => {
  const bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    cartTotal.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};

function updateStockInfo() {
  const stockInfo = document.getElementById("stock-status");
  const productList = getProductList();

  let infoMessage = "";
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ": " +
        (item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음)" : "품절") +
        "\n";
    }
  });
  stockInfo.textContent = infoMessage;
}
