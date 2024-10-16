import { useCartOperations } from '../hooks';
import { useCartStore } from '../stores';
import type { CartItemModel } from '../types/cart';
import OperationButton from './OperationButton';

type Props = {
  cartItem: CartItemModel;
};

const CartItem = ({ cartItem }: Props) => {
  const removeStoreCartItem = useCartStore((state) => state.removeStoreCartItem);
  const { handleCartItemQuantity } = useCartOperations();

  return (
    <article id="p1" className="flex justify-between items-center mb-2">
      <span>
        {cartItem.name} - {cartItem.price}원 x {cartItem.cartQuantity}
      </span>
      <div>
        <OperationButton value={-1} onClick={(event) => handleCartItemQuantity(event, cartItem)}>
          -
        </OperationButton>
        <OperationButton value={1} onClick={(event) => handleCartItemQuantity(event, cartItem)}>
          +
        </OperationButton>
        <button
          onClick={() => removeStoreCartItem(cartItem)}
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id="p1"
        >
          삭제
        </button>
      </div>
    </article>
  );
};

export default CartItem;
