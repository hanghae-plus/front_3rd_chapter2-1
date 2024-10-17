import { QUANTITY_CHANGE } from "@/constants";
import { ProductOption } from "@/types";

type CartItemProps = {
  data: ProductOption;
  onClick: (quantity: number) => void;
};

export default function CartItem({ data, onClick }: CartItemProps) {
  const { id, name, price: price, quantity: quantity } = data;

  return (
    <div className="flex justify-between items-center mb-2" id={id}>
      <span>{`${name} - ${price}원 x ${quantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onClick(QUANTITY_CHANGE.MINUS)}
          data-change={-1}
          data-testid="minus-button"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onClick(QUANTITY_CHANGE.PLUS)}
          data-change={1}
          data-testid="plus-button"
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onClick(QUANTITY_CHANGE.REMOVE)}
          data-testid="remove-button"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
