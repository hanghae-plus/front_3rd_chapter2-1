import { QUANTITY_CHANGE } from "../constants/product";
import type { ProductOption } from "../types/cart";
import CartItem from "./CartItem";

type CartItemsProps = {
  items: ProductOption[];
  onClick?: (productId: string, quantity: number) => void;
};

export default function CartItems({ items, onClick }: CartItemsProps) {
  const handleClick = (productId: string, originalQuantity: number) => (quantity: number) => {
    onClick?.(productId, quantity === QUANTITY_CHANGE.REMOVE ? -originalQuantity : quantity);
  };

  return (
    <div id="cart-items">
      {items.map((item) =>
        item.q === 0 ? null : (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            quantity={item.q}
            price={item.val}
            onClick={handleClick(item.id, item.q)}
          />
        ),
      )}
    </div>
  );
}
