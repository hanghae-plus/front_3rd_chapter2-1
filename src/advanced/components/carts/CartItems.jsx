import React from 'react'

export const CartItems = ({ cartList }) => {
  console.log(cartList[0])
  return (
    <div id="cart-items">
      {cartList.map((cartItem) => {
        return (
          <div key={cartItem.id} id={cartItem.id} className="mb-2 flex items-center justify-between">
            <span>{`${cartItem.name} - ${cartItem.price} x 1`}</span>
            <div>
              <button className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white" data-product-id={cartItem.id} data-change="-1">
                -
              </button>
              <button className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white" data-product-id={cartItem.id} data-change="1">
                +
              </button>
              <button className="remove-item rounded bg-red-500 px-2 py-1 text-white" data-product-id={cartItem.id}>
                삭제
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
