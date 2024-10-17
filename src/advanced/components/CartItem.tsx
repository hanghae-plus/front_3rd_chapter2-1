const CartItem = ({ id, name, price }: { id: string; name: string; price: number }) => {
  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>{`${name} - ${price}원 x 1`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          data-change="-1"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          data-change="1"
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={id}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
