import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import ItemSelecter from "./ItemSelecter";

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CartItemAdit = () => {
  const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);

  return (
    <div>
      <CartItem selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
      <ItemSelecter selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
    </div>
  );
};

export default CartItemAdit;
