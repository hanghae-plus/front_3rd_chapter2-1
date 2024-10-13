import { productList } from "../../utils.js";

let totalAmount, itemCount, bonusPoints;
let cartTotal, cartDisplay;

export function calculateCart() {
  cartDisplay = document.getElementById("cart-items");
  cartTotal = document.getElementById("cart-total");

  itemCount = 0;
  totalAmount = 0;

  const cartItems = cartDisplay.children;
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
      const itemTot = curItem.val * q;
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

  cartTotal.textContent = "총액: " + Math.round(totalAmount) + "원";
  if (discRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderbonusPoints();
}
const renderbonusPoints = () => {
  bonusPoints = 0;

  bonusPoints += Math.floor(totalAmount / 1000);
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

  let infoMessage = "";
  productList.forEach(function (item) {
    if (item.q < 5) {
      infoMessage +=
        item.name + ": " + (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") + "\n";
    }
  });
  stockInfo.textContent = infoMessage;
}
