import { useStore } from '../stores/store';
import CartItem from './CartItem';

const CartItems = () => {
  const cartItems = useStore((state) => state.cartItems);

  return (
    <div id="cart-items">
      {cartItems.map((cartItem) => (
        <CartItem key={cartItem.id} cartItem={cartItem} />
      ))}
    </div>
  );
};

export default CartItems;
