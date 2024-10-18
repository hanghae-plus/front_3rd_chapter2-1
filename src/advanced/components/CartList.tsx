import useCartStore from '../store/useCartStore';
import CartItem from './CartItem';
import CartItemsInfo from './CartItemsInfo';

const CartList: React.FC = () => {
  const { cartList } = useCartStore();
  return (
    <>
      <div id="cart-items">
        {cartList.map((item) => (
          <CartItem product={item} key={item.id} />
        ))}
      </div>
      <CartItemsInfo />
    </>
  );
};
export default CartList;
