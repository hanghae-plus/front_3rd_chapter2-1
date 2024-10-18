import { DeleteCart, UpsertCart } from '../hooks/useCart';
import { CartListType } from '../model/product';
import { Button } from './Shared/Button';

interface CartListProps {
  cartList: CartListType;
  handleUpsertCart: UpsertCart;
  handleDeleteCart: DeleteCart;
}

export const CartList = ({
  cartList,
  handleUpsertCart,
  handleDeleteCart,
}: CartListProps) => {
  return (
    <div>
      {cartList.map((item) => {
        const { id, name, price, quantity } = item;
        return (
          <div key={id} className="flex justify-between items-center mb-2">
            <span>
              {name} - {price}원 x {quantity}
            </span>
            <div className="flex gap-1">
              <Button text="-" onClick={() => handleUpsertCart(id, -1)} />
              <Button text="+" onClick={() => handleUpsertCart(id, 1)} />
              <Button
                text="삭제"
                colorVariants="red"
                onClick={() => handleDeleteCart(item)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
