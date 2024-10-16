import { ProductItem } from '../../model/product';
import { Button } from '../Button';

interface CartItemProps {
  item: ProductItem;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { id, name, price, quantity } = item;

  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {price}원 x {quantity}
      </span>
      <div className="flex gap-1">
        <Button text="-" data-product-id={id} data-change="-1" />
        <Button text="+" data-product-id={id} data-change="1" />
        <Button text="삭제" colorVariants="red" data-product-id={id} />
      </div>
    </div>
  );
};
