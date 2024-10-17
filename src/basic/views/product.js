import { store } from "../store/cart";

export const updateSelectOptions = () => {
  const { products } = store.getState();
  const select = document.getElementById("product-select");
  select.innerHTML = "";
  products.forEach(function (item) {
    const option = document.createElement("option");
    option.value = item.id;

    option.textContent = item.name + " - " + item.value + "원";
    if (item.quantity === 0) option.disabled = true;
    select.appendChild(option);
  });
};
