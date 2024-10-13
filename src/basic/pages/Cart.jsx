export default function Cart(cart, products) {
  return (
    <>
      <div id="cart-items">
        $
        {cart
          .map((item) => {
            const product = products.find((p) => p.id === item.id)
            return `
            <div class="flex justify-between items-center mb-2">
              <span>${product.name} - ${product.val}원 x ${item.quantity}</span>
              <div>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-id="${item.id}" data-change="-1">-</button>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-id="${item.id}" data-change="1">+</button>
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-id="${item.id}">삭제</button>
              </div>
            </div>
          `
          })
          .join('')}
      </div>
      <div id="cart-total" class="text-xl font-bold my-4">
        총액: ${calculateTotal(cart, products)}원
      </div>
    </>
  )
}
