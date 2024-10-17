import { calcCart } from "../views/cart";
import { store } from "../store/cart";

export const addToCart = () => {
  const selectItemValue = document.getElementById("product-select").value;
  const cartDisplay = document.getElementById("cart-items");
  const { products } = store.getState();

  const itemToAdd = products.find((product) => {
    return product.id === selectItemValue;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    const updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex((product) => product.id === itemToAdd.id);

    if (item) {
      const newQuantity = parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.value + "원 x " + newQuantity;
        updatedProducts[productIndex] = { ...itemToAdd, quantity: itemToAdd.quantity - 1 };
        store.setState({ ...store.getState(), products: updatedProducts });
        // itemToAdd.q--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.value +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisplay.appendChild(newItem);
      // itemToAdd.q--;
      updatedProducts[productIndex] = { ...itemToAdd, quantity: itemToAdd.quantity - 1 };
      store.setState({ ...store.getState(), products: updatedProducts });
    }
    calcCart();
    store.setState({ ...store.getState(), lastSel: selectItemValue });
  }
};
