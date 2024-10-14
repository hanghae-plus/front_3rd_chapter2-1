import { getProductList } from "../../stores/productListStore";

const DISCOUNT_THRESHOLDS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

let totalAmount, itemCount, accumulatedPoints;
let cartTotal, cartContainer;

export const calculateCart = () => {
  cartContainer = document.getElementById("cart-items");
  cartTotal = document.getElementById("cart-total");
  itemCount = 0;
  totalAmount = 0;

  const cartItems = cartContainer.children;
  const productList = getProductList();

  // 총액 계산
  let subTotal = 0;
  for (const item of cartItems) {
    const currentProduct = productList.find((product) => product.id === item.id);
    const quantity = parseInt(item.querySelector("span").textContent.split("x ")[1]);
    const itemTotal = currentProduct.price * quantity;

    itemCount += quantity;
    subTotal += itemTotal;

    const disc =
      quantity >= 10 && currentProduct.id in DISCOUNT_THRESHOLDS
        ? DISCOUNT_THRESHOLDS[currentProduct.id]
        : 0;
    totalAmount += itemTotal * (1 - disc);
  }
  let discountRate = (subTotal - totalAmount) / subTotal;
  if (itemCount >= 30) {
    const bulkDiscount = 0.25;
    if (bulkDiscount > discountRate) {
      totalAmount = subTotal * (1 - bulkDiscount);
      discountRate = bulkDiscount;
    }
  }

  // 화요일 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartTotal.textContent = "총액: " + Math.round(totalAmount) + "원";

  // 할인 적용 표시
  if (discountRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderbonusPoints();
};

// 포인트 적립
const renderbonusPoints = () => {
  const newPoints = Math.floor(totalAmount / 1000);
  accumulatedPoints = (accumulatedPoints || 0) + newPoints;
  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    cartTotal.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + accumulatedPoints + ")";
};

// 재고 표시
const updateStockInfo = () => {
  const stockInfo = document.getElementById("stock-status");
  const productList = getProductList();

  const infoMessage = productList
    .filter((item) => item.quantity < 5)
    .map(
      (item) =>
        `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"}`,
    )
    .join("\n");

  stockInfo.textContent = infoMessage;
};
