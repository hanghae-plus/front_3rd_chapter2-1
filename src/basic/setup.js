import { addCart, updateCart } from "./features/Cart";

// 초기화
export const setup = () => {
  const root = document.getElementById("app");
  const container = document.createElement("div");
  const wrap = document.createElement("div");
  const headerText = document.createElement("h1");
  const cartContainer = document.createElement("div");
  const sum = document.createElement("div");
  const selectEl = document.createElement("select");
  const addToCartButton = document.createElement("button");
  const stockInfo = document.createElement("div");

  cartContainer.id = "cart-items";
  sum.id = "cart-total";
  selectEl.id = "product-select";
  addToCartButton.id = "add-to-cart";
  stockInfo.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  headerText.className = "text-2xl font-bold mb-4";
  sum.className = "text-xl font-bold my-4";
  selectEl.className = "border rounded p-2 mr-2";
  addToCartButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";
  headerText.textContent = "장바구니";
  addToCartButton.textContent = "추가";

  wrap.appendChild(headerText);
  wrap.appendChild(cartContainer);
  wrap.appendChild(sum);
  wrap.appendChild(selectEl);
  wrap.appendChild(addToCartButton);
  wrap.appendChild(stockInfo);
  container.appendChild(wrap);
  root.appendChild(container);

  addToCartButton.addEventListener("click", () => {
    addCart(selectEl, cartContainer);
  });
  cartContainer.addEventListener("click", updateCart);
};
