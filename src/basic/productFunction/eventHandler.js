import { productConst } from "../const";
import { productQuantityPriceRelation } from "./productQuantityPriceRelated";

export let handleAddItemButtonClick = (
  cartItemSelector,
  cartItemList,
  totalAmount,
  stockInfo,
  lastSelectedOption,
) => {
  const { PRODUCT_LIST } = productConst;
  const { priceCalculation } = productQuantityPriceRelation;

  let selectedOptionId = cartItemSelector.value;
  let itemToAdd = PRODUCT_LIST.find((p) => p.id === selectedOptionId);

  // 아이템이 없거나, 재고가 없는 경우 리턴
  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  let item = document.getElementById(itemToAdd.id);

  if (item) {
    let currentQuantity = parseInt(item.querySelector("span").textContent.split("x ")[1]);
    let newQuantity = currentQuantity + 1;

    if (newQuantity > itemToAdd.quantity) {
      return alert("재고가 부족합니다.");
    }

    item.querySelector("span").textContent =
      `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQuantity}`;
    itemToAdd.quantity--;
  } else {
    let newItem = document.createElement("div");
    newItem.id = itemToAdd.id;
    newItem.className = "flex justify-between items-center mb-2";
    newItem.innerHTML = `
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
      </div>`;
    cartItemList.appendChild(newItem);
    itemToAdd.quantity--;
  }

  priceCalculation(cartItemList, totalAmount, stockInfo);

  // 마지막 선택된 상품 ID 업데이트
  lastSelectedOption = selectedOptionId;
};

export let handleQuantityEditButtonClick = (event, cartItemList, totalAmount, stockInfo) => {
  const { PRODUCT_LIST } = productConst;
  const { priceCalculation } = productQuantityPriceRelation;

  let target = event.target;
  let prodId = target.dataset.productId;
  let itemElement = document.getElementById(prodId);
  let targetProduct = PRODUCT_LIST.find((p) => p.id === prodId);

  if (!target.classList.contains("quantity-change") && !target.classList.contains("remove-item")) {
    return;
  }

  if (!itemElement || !targetProduct) return;

  if (target.classList.contains("quantity-change")) {
    let quantityChange = parseInt(target.dataset.change);
    let currentQuantity = parseInt(itemElement.querySelector("span").textContent.split("x ")[1]);
    let newQuantity = currentQuantity + quantityChange;

    if (newQuantity <= 0) {
      itemElement.remove();
      targetProduct.quantity += currentQuantity;
      return priceCalculation(cartItemList, totalAmount, stockInfo);
    }

    if (newQuantity > targetProduct.quantity + currentQuantity) {
      return alert("재고가 부족합니다.");
    }

    itemElement.querySelector("span").textContent =
      itemElement.querySelector("span").textContent.split("x ")[0] + "x " + newQuantity;
    targetProduct.quantity -= quantityChange;
  }

  if (target.classList.contains("remove-item")) {
    let remQty = parseInt(itemElement.querySelector("span").textContent.split("x ")[1]);
    targetProduct.quantity += remQty;
    itemElement.remove();
  }

  priceCalculation(cartItemList, totalAmount, stockInfo);
};
