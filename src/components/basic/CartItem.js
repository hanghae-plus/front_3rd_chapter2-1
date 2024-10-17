export default function CartItem({ name, price, id }) {
  const countButtonClass = 'quantity-change bg-blue-500 mr-1 text-white px-2 py-1 rounded'
  const removeButtonClass = 'remove-item bg-red-500 text-white px-2 py-1 rounded'
  return `
    <span>${name} - ${price}원 x 1</span>
    <div>
      <button class="${countButtonClass}" data-product-id="${id}" data-change="-1">-</button>
      <button class="${countButtonClass}" data-product-id="${id}" data-change="1">+</button>
      <button class="${removeButtonClass}" data-product-id="${id}">삭제</button>
    </div>
  `
}
