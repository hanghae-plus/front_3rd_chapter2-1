import { store } from "../store/cart";

let bonusPoints = 0,
  totalAmountt = 0,
  itemCount = 0;

export function calcCart() {
  totalAmountt = 0;
  itemCount = 0;
  const cartDisplay = document.getElementById("cart-items");
  const { products } = store.getState();
  const cartItems = cartDisplay.children;

  let subTotal = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentItem = products[j];
          break;
        }
      }

      const quantity = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      const itemTotal = currentItem.value * quantity;
      let discount = 0;
      itemCount += quantity;
      subTotal += itemTotal;
      if (quantity >= 10) {
        if (currentItem.id === "p1") discount = 0.1;
        else if (currentItem.id === "p2") discount = 0.15;
        else if (currentItem.id === "p3") discount = 0.2;
        else if (currentItem.id === "p4") discount = 0.05;
        else if (currentItem.id === "p5") discount = 0.25;
      }
      totalAmountt += itemTotal * (1 - discount);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    var bulkDisc = totalAmountt * 0.25;
    var itemDisc = subTotal - totalAmountt;
    if (bulkDisc > itemDisc) {
      totalAmountt = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmountt) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmountt) / subTotal;
  }
  totalAmountt;

  if (new Date().getDay() === 2) {
    totalAmountt *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  const sum = document.getElementById("cart-total");
  sum.textContent = "총액: " + Math.round(totalAmountt) + "원";
  if (discountRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints += Math.floor(totalAmountt / 1000);
  let pointsTag = document.getElementById("loyalty-points");
  const sum = document.getElementById("cart-total");
  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    sum.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};

function updateStockInfo() {
  let infoMessage = "";
  const { products } = store.getState();
  products.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ": " +
        (item.quantity > 0 ? "재고 부족 (" + item.quantity + "개 남음)" : "품절") +
        "\n";
    }
  });
  const stockInfo = document.getElementById("stock-status");
  stockInfo.textContent = infoMessage;
}
