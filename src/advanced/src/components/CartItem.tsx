import OperationButton from './OperationButton';

const CartItem = () => {
  return (
    <article id="p1" className="flex justify-between items-center mb-2">
      <span>상품1 - 10000원 x 2</span>
      <div>
        <OperationButton value={-1}>-</OperationButton>
        <OperationButton value={1}>+</OperationButton>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="p1">
          삭제
        </button>
      </div>
    </article>
  );
};

export default CartItem;
