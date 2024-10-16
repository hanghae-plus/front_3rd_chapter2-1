export default function CustomOption({ id, name, value, quantity }) {
  return `<option value="${id}" ${!quantity ? 'disabled' : ''}>${name} - ${value}원</option>`
}
