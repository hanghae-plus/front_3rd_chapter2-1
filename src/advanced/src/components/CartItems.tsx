import { useStore } from '../stores/cartStore';
import CartItem from './CartItem';

const CartItems = () => {
  const storeCartItems = useStore((state) => state.cartItems);

  return (
    <div id="cart-items">
      {storeCartItems.map((cartItem) => (
        <CartItem key={cartItem.id} cartItem={cartItem} />
      ))}
    </div>
  );
};

export default CartItems;
