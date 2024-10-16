import { ProductList } from '../../model/product';
import { CartItem } from './CartItem';

interface CartListProps {
  cartList: ProductList;
}

export const CartList = ({ cartList }: CartListProps) => {
  return (
    <div>
      {cartList.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};
