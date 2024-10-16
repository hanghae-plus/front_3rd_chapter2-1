import { addToCart } from "./utils/addCart";
import { updateCart } from "./utils/updateCart";
import { calcCart } from "./views/cart";
import { renderDiscounts } from "./views/discount";
import { updateSelectOptions } from "./views/product";

let addButton;
let cartDisplay;

const main = () => {
  renderInit();

  updateSelectOptions();

  calcCart();

  renderDiscounts();

  addButton.addEventListener("click", addToCart);
  cartDisplay.addEventListener("click", updateCart);
};

const renderInit = () => {
  const root = document.getElementById("app");
  const container = document.createElement("div");
  const wrap = document.createElement("div");
  const title = document.createElement("h1");
  cartDisplay = document.createElement("div");
  const sum = document.createElement("div");
  const select = document.createElement("select");
  addButton = document.createElement("button");
  const stockInfo = document.createElement("div");

  cartDisplay.id = "cart-items";
  sum.id = "cart-total";
  select.id = "product-select";
  addButton.id = "add-to-cart";
  stockInfo.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  title.className = "text-2xl font-bold mb-4";
  sum.className = "text-xl font-bold my-4";
  select.className = "border rounded p-2 mr-2";
  addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";

  title.textContent = "장바구니";
  addButton.textContent = "추가";

  wrap.appendChild(title);
  wrap.appendChild(cartDisplay);
  wrap.appendChild(sum);
  wrap.appendChild(select);
  wrap.appendChild(addButton);
  wrap.appendChild(stockInfo);
  container.appendChild(wrap);
  root.appendChild(container);
};

main();
