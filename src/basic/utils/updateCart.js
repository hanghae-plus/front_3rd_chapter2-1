import { calcCart } from "../views/cart";
import { store } from "../store/cart";

export const updateCart = (event) => {
  const target = event.target;

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const productId = target.dataset.productId;
    const itemElem = document.getElementById(productId);
    const { products } = store.getState();
    const updatedProducts = [...products];
    const product = products.find((product) => product.id === productId);
    const productIndex = updatedProducts.findIndex((product) => product.id === productId);

    if (target.classList.contains("quantity-change")) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
        itemElem.querySelector(
          "span",
        ).textContent = `${product.name} - ${product.value}원 x ${newQuantity}`;
        updatedProducts[productIndex] = { ...product, quantity: product.quantity - quantityChange };
        store.setState({ ...store.getState(), products: updatedProducts });
      } else if (newQuantity <= 0) {
        itemElem.remove();
        updatedProducts[productIndex] = { ...product, quantity: product.quantity - quantityChange };
        store.setState({ ...store.getState(), products: updatedProducts });
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const removeQuantity = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      updatedProducts[productIndex] = { ...product, quantity: product.quantity + removeQuantity };
      store.setState({ ...store.getState(), products: updatedProducts });
      itemElem.remove();
    }
    calcCart();
  }
};
