import { useCartContext } from '../utils/hooks';

export default function CartList() {
  const { cartList } = useCartContext();

  console.log('cartList', cartList);

  return (
    <div id="cart-items">
      {cartList?.map((cart) => (
        <div
          key={cart.id}
          id={cart.id}
          className="flex justify-between items-center mb-2"
        >
          <span>
            {cart.name} - {cart.price}원 x {cart.quantity}
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={cart.id}
              data-change="-1"
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={cart.id}
              data-change="1"
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              data-product-id={cart.id}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
