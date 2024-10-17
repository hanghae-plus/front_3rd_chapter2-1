import useCartStore from '../store/useCartStore';
import CartItem from './CartItem';

const CartList: React.FC = () => {
  const { cartList } = useCartStore();
  return (
    <>
      <div id="cart-items">
        {cartList.map((item) => (
          <CartItem product={item} key={item.id} />
        ))}
      </div>
      <CartTotalInfo />
    </>
  );
};

const CartTotalInfo: React.FC = () => {
  return <div id="cart-total" className="text-xl font-bold my-4"></div>;
};

export default CartList;
