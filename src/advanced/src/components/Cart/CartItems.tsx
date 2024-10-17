import { useCallback } from "react";

import { QUANTITY_CHANGE } from "@/constants";
import type { ProductOption } from "@/types";

import CartItem from "./CartItem";

type CartItemsProps = {
  items: ProductOption[];
  onClick: (data: ProductOption) => void;
};

export default function CartItems({ items, onClick }: CartItemsProps) {
  const handleQuantityChange = useCallback(
    (item: ProductOption) => (quantity: number) => {
      const data = {
        ...item,
        quantity: quantity === QUANTITY_CHANGE.REMOVE ? -item.quantity : quantity,
      };
      onClick?.(data);
    },
    [onClick],
  );

  return (
    <div id="cart-items">
      {items.map((item) =>
        item.quantity === 0 ? null : <CartItem key={item.id} data={item} onClick={handleQuantityChange(item)} />,
      )}
    </div>
  );
}
