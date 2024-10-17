import { QUANTITY_CHANGE } from "@/constants";
import { ProductOption } from "@/types";

type CartItemProps = {
  data: ProductOption;
  onClick?: (quantity: number) => void;
};

//TODO: 일단 관련 이벤트들 여기에다가 만들어보고 구리다 싶으면 개선하기

export default function CartItem({ data, onClick }: CartItemProps) {
  const { id, name, val: price, q: quantity } = data;
  const controlQuantity = (quantity: number) => {
    onClick?.(quantity);
  };

  return (
    <div className="flex justify-between items-center mb-2" id={id}>
      <span>{`${name} - ${price}원 x ${quantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => controlQuantity(QUANTITY_CHANGE.MINUS)}
          data-change={-1}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => controlQuantity(QUANTITY_CHANGE.PLUS)}
          data-change={1}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => controlQuantity(QUANTITY_CHANGE.REMOVE)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
