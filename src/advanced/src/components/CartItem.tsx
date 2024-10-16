import { QUANTITY_CHANGE } from "../constants/product";

type CartItemProps = {
  name: string;
  quantity: number;
  price: number;
  onClick?: (quantity: number) => void;
  id: string;
};

//TODO: 일단 관련 이벤트들 여기에다가 만들어보고 구리다 싶으면 개선하기

export default function CartItem({ name, quantity, price, onClick, id }: CartItemProps) {
  const controlQuantity = (type: "MINUS" | "PLUS" | "REMOVE") => {
    onClick?.(QUANTITY_CHANGE[type]);
  };

  return (
    <div className="flex justify-between items-center mb-2" id={id} data-testId={id}>
      <span>{`${name} - ${price}원 x ${quantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => controlQuantity("MINUS")}
          data-change={-1}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => controlQuantity("PLUS")}
          data-change={1}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => controlQuantity("REMOVE")}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
