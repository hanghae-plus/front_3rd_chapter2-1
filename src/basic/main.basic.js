import {
  handleAddItemButtonClick,
  handleQuantityEditButtonClick,
} from "../basic/productFunction/eventHandler";
import { productQuantityPriceRelation } from "../basic/productFunction/productQuantityPriceRelated";
import { productConst } from "./const";

function main() {
  const { PRODUCT_LIST } = productConst;
  const { updateSelectOptions, priceCalculation } = productQuantityPriceRelation;

  let lastSelectedOption;
  let root = document.getElementById("app");

  // root의 자식 요소들 삭제 (기존 장바구니 요소가 있으면 삭제)
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;

  const cartItemList = document.getElementById("cart-items");
  const totalAmount = document.getElementById("cart-total");
  const cartItemSelector = document.getElementById("product-select");
  const addItemButton = document.getElementById("add-to-cart");
  const stockInfo = document.getElementById("stock-status");

  updateSelectOptions(PRODUCT_LIST, cartItemSelector);
  priceCalculation(cartItemList, totalAmount, stockInfo);

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions(PRODUCT_LIST, cartItemSelector);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedOption) {
        let suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSelectedOption && item.quantity > 0;
        });
        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelectOptions(PRODUCT_LIST, cartItemSelector);
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  addItemButton.addEventListener("click", () =>
    handleAddItemButtonClick(
      cartItemSelector,
      cartItemList,
      totalAmount,
      stockInfo,
      lastSelectedOption,
    ),
  );

  cartItemList.addEventListener("click", (event) =>
    handleQuantityEditButtonClick(event, cartItemList, totalAmount, stockInfo),
  );
}

main();
