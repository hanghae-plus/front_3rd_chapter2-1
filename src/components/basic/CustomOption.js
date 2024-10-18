export default function CustomOption({ id, name, price, quantity }) {
  return `<option value="${id}" ${!quantity ? 'disabled' : ''}>${name} - ${price}원</option>`
}
