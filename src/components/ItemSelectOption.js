export default function ItemSelectOption({ id, quantity, name, price }) {
  return `<option value="${id}" disabled="${quantity === 0}">${name} - ${price}원</option>`;
}
