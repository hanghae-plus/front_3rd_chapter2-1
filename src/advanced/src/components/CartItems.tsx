import { useStore } from '../stores/store';
import CartItem from './CartItem';

const CartItems = () => {
  const cartItems = useStore((state) => state.cartItems);
  console.log(cartItems);

  return (
    <div id="cart-items">
      {cartItems.map((cartItem) => (
        <CartItem />
      ))}
    </div>
  );
};

export default CartItems;
