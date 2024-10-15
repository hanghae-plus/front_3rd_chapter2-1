import { productList } from "../data"

export const ProductSelect = () => {
  return `
    <select id="product-select" class="border rounded p-2 mr-2">
      ${productList.map((prod) => `<option value="${prod.id}" ${prod.quantity === 0 ? "disabled" : ""}>${prod.name} - ${prod.price}원</option>`)}
    </select>
  `
}
