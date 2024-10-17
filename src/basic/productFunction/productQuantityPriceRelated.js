import { productConst } from "../const";
import { state } from "../store";

function updateSelectOptions(list, cartItemSelector) {
  cartItemSelector.innerHTML = "";
  list.forEach((item) => {
    let option = document.createElement("option");
    option.value = item.id;

    option.textContent = item.name + " - " + item.price + "원";
    if (item.quantity === 0) {
      option.disabled = true;
    }
    cartItemSelector.appendChild(option);
  });
}

function updateStockInfo(productList, stockInfo) {
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

function priceCalculation(cartItemList, totalAmount, stockInfo) {
  const { PRODUCT_LIST, DISCOUNT_RATE_LIST } = productConst;

  let cartItems = cartItemList.children;
  let totalItemsAmount = 0; // 할인 적용 후 총 금액을 저장할 변수
  let itemCount = 0;
  let amountBeforeDiscount = 0;
  let discountRate = 0;

  function getDiscountRate(currentItem, quantity) {
    if (quantity < 10) return 0; // 수량이 10개 미만이면 0 반환
    return DISCOUNT_RATE_LIST[currentItem.id] || 0; // 10개 이상일 때 할인률 반환
  }

  Array.from(cartItems).forEach((cartItem) => {
    let currentItem = PRODUCT_LIST.find((p) => p.id === cartItem.id);
    let currentItemId = document.getElementById(currentItem.id);
    if (!currentItem) return;

    let quantity = parseInt(currentItemId.querySelector("span").textContent.split("x ")[1]);
    let itemTotalAmount = currentItem.price * quantity;
    let discount = getDiscountRate(currentItem, quantity);

    itemCount += quantity;
    amountBeforeDiscount += itemTotalAmount;
    totalItemsAmount += itemTotalAmount * (1 - discount);
  });

  if (itemCount >= 30) {
    let bulkDisc = totalItemsAmount * 0.25;
    let itemDisc = amountBeforeDiscount - totalItemsAmount;
    if (bulkDisc > itemDisc) {
      totalItemsAmount = amountBeforeDiscount * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (amountBeforeDiscount - totalItemsAmount) / amountBeforeDiscount;
    }
  } else {
    discountRate = (amountBeforeDiscount - totalItemsAmount) / amountBeforeDiscount;
  }

  if (new Date().getDay() === 2) {
    // 금요일에 추가 할인 적용
    totalItemsAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  totalAmount.textContent = "총액: " + Math.round(totalItemsAmount) + "원";

  if (discountRate > 0) {
    let span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    totalAmount.appendChild(span);
  }
  updateStockInfo(PRODUCT_LIST, stockInfo);
  renderBonusPoints(totalAmount, totalItemsAmount);
}

// let bonusPoints = 0;
const renderBonusPoints = (totalAmount, totalItemsAmount) => {
  const { bonusPointsState } = state;
  bonusPointsState.bonusPoints += Math.floor(totalItemsAmount / 1000);

  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    totalAmount.appendChild(pointsTag);
  }
  pointsTag.textContent = `(포인트: ${bonusPointsState.bonusPoints})`;
};

export const productQuantityPriceRelation = {
  updateSelectOptions,
  priceCalculation,
};
