import { ICart } from '../types';

export interface ICartItemProps extends ICart {
  onAdd: (itemId: ICart['id']) => void;
  onMinus: (itemId: ICart['id']) => void;
  onRemove: (itemId: ICart['id']) => void;
}

export const CartItem = ({
  id,
  name,
  price,
  quantity,
  onAdd,
  onMinus,
  onRemove,
}: ICartItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <span>
        {name} - {price}원 x {quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onAdd(id)}
        >
          +
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onMinus(id)}
        >
          -
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemove(id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
