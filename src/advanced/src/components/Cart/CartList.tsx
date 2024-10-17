import { Product } from "../../types";
import CartItem from "./CartItem";

interface CartListProps {
  cartItems: Product[];
  updateCartItemQuantity: (productId: string, change: number) => void;
  removeCartItem: (productId: string) => void;
}

const CartList = ({ cartItems, updateCartItemQuantity, removeCartItem }: CartListProps) => {
  return (
    <div>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          product={item}
          updateCartItemQuantity={updateCartItemQuantity}
          removeCartItem={removeCartItem}
        />
      ))}
    </div>
  );
};

export default CartList;
